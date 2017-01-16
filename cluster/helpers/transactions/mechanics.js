var dbconfig = require('../../config/credentials/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var childProcess = require('child_process');

var bank_data = dbconfig.banks["Mechanics Bank"];


var processes = {};

// TODO worry about concurrency issues
function updateTransactions(user) {
  connection.query("SELECT id,collection_count FROM " +
    dbconfig.database + '.' + dbconfig.bank_accounts_table + " WHERE user_id=? AND bank_id=?",
    [user.id, bank_data.id], function(err, results) {
      var count = results[0].collection_count;
      var bankAccountId = results[0].id;
      var cmd = './helpers/transactions/scripts/getTransactionsMechanics.sh';
      var process = childProcess.spawn(cmd, ["Mechanics" + count]);
      processes[user.id] = process;

      process.stdout.on("data", function(data) {
        console.log('data:', data.toString());
      });

      process.on("close", function(code) {
        processes[user.id] = undefined;
      });

      connection.query("UPDATE " + dbconfig.database + '.' + dbconfig.bank_accounts_table +
        " SET collection_count = collection_count + 1 WHERE id=?", [bankAccountId], function(err, results) {
      });

      //process.stdin.write('1 + 1');
      //process.stdin.end();

      // exec(cmd, function(error, stdout, stderr) {
      //   console.log(error, stdout, stderr, results[0]);
      // });

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
