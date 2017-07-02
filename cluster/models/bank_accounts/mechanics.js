var dbconfig = require('../../config/credentials/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);

var bank = dbconfig.banks["Mechanics Bank"];

function add(user, bankInfo, callback) {
  // INSERT INTO bankaccounts
  connection.query("INSERT INTO " + dbconfig.database + "." +
    dbconfig.accounts_table + " (bank_id, user_id) VALUES (?, ?)",
    [bank.id, user.id], callback);
}


module.exports = {
  name: "mechanics",
  add: add
};
