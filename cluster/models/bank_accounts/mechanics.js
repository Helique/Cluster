var dbconfig = require('../../config/credentials/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);

var bank = dbconfig.banks[0];

function add(user, bankInfo, callback) {
  // INSERT INTO bankaccounts
  connection.query("INSERT INTO " + dbconfig.database + "." +
    dbconfig.bank_accounts_table + " (bank_id, user_id) VALUES (?, ?)",
    [bank.id, user.id], callback);
}


module.exports = {
  name: "mechanics",
  add: add
};
