var Mechanics = require("./mechanics");
var dbconfig = require('../../config/credentials/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var transactionsManager = require("../../helpers/transactions/manager")


function add(user, bankInfo, callback) {
  var name = bankInfo.name;
  if (name == "Mechanics Bank") {
    Mechanics.add(user, bankInfo, callback);
  }
  // else if (name == "...") { }
  else {
    callback(new Error("Bank named " + name + " not supported"));
  }
}

function getAll(user, callback) {
  // SELECT bankAccounts.* FROM bankAccounts INNER JOIN users ON bankAccounts.user_id=?

  console.log("SELECT * FROM " + dbconfig.database + "." +
    dbconfig.bank_accounts_table + " WHERE user_id=?");
  connection.query("SELECT * FROM " + dbconfig.database + "." +
    dbconfig.bank_accounts_table + " WHERE user_id=?", [user.id], callback);
}

function update(user, callback) {

  connection.query("SELECT DISTINCT bank_id FROM " + dbconfig.database + "." +
   dbconfig.bank_accounts_table + " WHERE user_id=?", [user.id], function(err, results) {
     results.forEach(function(result) {
       transactionsManager.updateTransactions(user, result.bank_id);
     });
     callback(err, results);
    });
}

module.exports = {
  add: add,
  getAll: getAll,
  update: update
};
