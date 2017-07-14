var Mechanics = require("./mechanics");
var Sierra = require("./sierra");
var dbconfig = require('../../config/credentials/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var transactionsManager = require("../../helpers/transactions/manager")

errors = {
  bankUnsupported: {error: "Unsupported Bank."},
  accountInUse: {error: "Account id in Use."},
  userNotFound: {error: "User not found."}
};

function add(user, bankInfo, accountNumber, callback) {
  var name = bankInfo.name;
  if (name == "Mechanics Bank") {
    Mechanics.add(user, bankInfo, accountNumber, function (err, rows) {
      if (err) {
        if(err.message.search("PRIMARY") >= 0){
          return callback(errors.accountInUse);
        }
        if(err.message.search("ER_NO_REFERENCED_ROW_2") >= 0){
          return callback(errors.userNotFound);
        }
        return callback(err);
      } else {
        return callback({id: accountNumber});
      }
    });
  }
  if (name == "Sierra Central") {
    Sierra.add(user, bankInfo, accountNumber, function (err, rows) {
      if (err) {
        if(err.message.search("PRIMARY") >= 0){
          return callback(errors.accountInUse);
        }
        if(err.message.search("ER_NO_REFERENCED_ROW_2") >= 0){
          return callback(errors.userNotFound);
        }
        callback(err);
      } else {
        return callback({id: accountNumber});
      }
    });
  }
  else {
    return callback(errors.bankUnsupported);
  }
}

function getAll(user, callback) {
  connection.query("SELECT * FROM " + dbconfig.database + "." +
    dbconfig.accounts_table + " WHERE user_id=?", [user.id], function(err, rows){
      if (err) {
        return callback(err);
      } else {
        return callback(rows);
      }
    });
}

function update(user, callback) {
  connection.query("SELECT DISTINCT bank_id FROM " + dbconfig.database + "." +
   dbconfig.accounts_table + " WHERE user_id=?", [user.id], function(err, results) {
     results.forEach(function(result) {
       transactionsManager.updateTransactions(user, result.bank_id);
     });
     callback(err, results);
    });
}

function onVerification(user, code, bank_id, callback) {
  console.log("verifying " + code + ", " + bank_id);
  transactionsManager.onVerification(user, code, bank_id, callback);
};

module.exports = {
  add: add,
  getAll: getAll,
  update: update,
  onVerification: onVerification,
  errors: errors
};
