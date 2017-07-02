/**
 * Created by david on 1/15/17.
 */
var dbconfig = require('../config/credentials/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
//var transactionsManager = require("/../helpers/transactions/manager")
var banks = {}

function rowsToBank(rowData){
  user = {}
  if(rowData.hasOwnProperty('id')){
    user.id = rowData.id
  }
  if(rowData.hasOwnProperty('name')){
    user.name = rowData.name
  }
  return user
}

banks.errors = {
  bankNotFound: {error: "Bank not Found."},
  nameInUse: {error: "Bank name in Use."},
  idInUser: {error: "Bank id in Use."}
};

banks.getSupported =  function(callback) {
    // SELECT bankAccounts.* FROM bankAccounts INNER JOIN users ON bankAccounts.user_id=?
    console.log("SELECT * FROM " + dbconfig.database + "." +
        dbconfig.banks_table);

    connection.query("SELECT * FROM " + dbconfig.database + "." +
        dbconfig.banks_table, callback);
}

banks.newBank = function(bank_id, bank_name, callback) {
  var insertQuery = "INSERT INTO " + dbconfig.banks_table + " (id, name) " +
    "VALUES (?, ?);";
  connection.query(insertQuery, [bank_id, bank_name], function(err, rows) {
    if (err) {
      if(err.message.search("name_UNIQUE") > 0){
        callback(banks.errors.nameInUse);
      }else if(err.message.search("PRIMARY") > 0){
        callback(banks.errors.idInUse);
      }
    } else {
      callback({id: bank_id});
    }
  });
}

banks.getByID =  function(bank_id, callback) {
    var query = "SELECT * FROM " + dbconfig.banks_table + " WHERE id=? LIMIT 1;";
    connection.query(query, [bank_id], function(err, rows) {
      if(rows.length > 0){
        callback(rowsToBank(rows[0]));
      } else {
        callback(banks.errors.bankNotFound);
      }
    });
}

banks.getByName =  function(bank_name, callback) {
  var query = "SELECT * FROM " + dbconfig.banks_table + " WHERE name=? LIMIT 1;";
  connection.query(query, [bank_name], function(err, rows) {
      if(rows.length > 0){
        callback(rowsToBank(rows[0]));
      } else {
        callback(banks.errors.bankNotFound);
      }
  });
}

module.exports = banks;
