var Mechanics = require("./mechanics");
var dbconfig = require('../../config/credentials/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);


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

  connection.query("SELECT * FROM " + dbconfig.database + "." +
    dbconfig.bank_accounts_table + " WHERE user_id=?", [user.id], callback);
}

module.exports = {
  add: add,
  getAll: getAll
};
