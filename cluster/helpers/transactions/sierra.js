var dbconfig = require('../../config/credentials/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var childProcess = require('child_process');
var transactionProcessor = require("./processor");
var charges = require('../../models/charges');
var fs = require("fs");


var bank_data = dbconfig.banks["Sierra Central"];


var processes = {};

// TODO worry about concurrency issues
function updateTransactions(user) {
  connection.query("SELECT id,collection_count FROM " +
    dbconfig.database + '.' + dbconfig.bank_accounts_table + " WHERE user_id=? AND bank_id=?",
    [user.id, bank_data.id], function(err, results) {
      var count = results[0].collection_count;
      var bankAccountId = results[0].id;
      console.log("update for sierra commencing");

      var cmd = './helpers/transactions/scripts/getTransactionsSierra.sh';

      var today = new Date();
      var filename = "Sierra" + today.getFullYear() +"_" + (today.getMonth() + 1) +"_"+ today.getDate() +"_"+today.getHours()+"_"+today.getMinutes()+"_"+today.getSeconds()+".qfx"
      //var filename = "Sierra" + count + ".qfx";

      var process = childProcess.spawn(cmd, [filename]);
      processes[user.id] = process;

      process.stdout.on("data", function(data) {
        console.log('data:', data.toString());
      });

      process.on("close", function(code) {
        processTransactions(filename, user);
        processes[user.id] = undefined;
      });

      connection.query("UPDATE " + dbconfig.database + '.' + dbconfig.bank_accounts_table +
        " SET collection_count = collection_count + 1 WHERE id=?", [bankAccountId], function(err, results) {
      });

    });
}

function processTransactions(filename, user) {
  fs.readFile("./transactions/" + filename, function(err, data) {
    transactionProcessor.parseQFX(data, function(err, transactions) {
      charges.saveTransactions(transactions, user, function(err, result) {
        //
      });
    });
  });
}

function onVerification(user, code, callback) {
  if (processes[user.id]) {
    processes[user.id].stdin.write(code + "\n");
  }
  else {
    console.log("process not found for user id " + user.id);
  }
  callback(null, "Yay");
}

module.exports = {
  updateTransactions: updateTransactions,
  onVerification: onVerification
};
