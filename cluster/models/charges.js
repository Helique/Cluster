/**
 * Created by david.bernadett on 7/5/16.
 */
var mysql = require('mysql');
var async = require('async');
var _ = require("lodash");
var dbconfig = require('../config/credentials/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
var charges = {};


charges.get = function(user, callback){
    //SELECT charges.*  FROM charges INNER JOIN users ON users.id=charges.user_id WHERE users.id=1;

    var getQuery = "SELECT "+ dbconfig.charges_table +".*, " +
      dbconfig.categories_table + ".category_name FROM " + dbconfig.charges_table +
       " LEFT JOIN " + dbconfig.categories_table + " ON "+
       dbconfig.charges_table+".category_id="+ dbconfig.categories_table+".id" +
       " INNER JOIN " + dbconfig.users_table + " ON " +
       dbconfig.users_table + ".id=" + dbconfig.charges_table + ".user_id " +
       "WHERE " + dbconfig.users_table + ".id=?";
    var rows = connection.query(getQuery, [user.id], function (err, rows) {
      if (err) console.log(err);
        return callback(rows);
    });
};

charges.getRange = function(user, start_date, end_date, callback){
    var getQuery = "SELECT "+ dbconfig.charges_table +".*, " +
      dbconfig.categories_table + ".category_name FROM " + dbconfig.charges_table +
       " LEFT JOIN " + dbconfig.categories_table + " ON "+
       dbconfig.charges_table+".category_id="+ dbconfig.categories_table+".id" +
       " INNER JOIN " + dbconfig.users_table + " ON " +
       dbconfig.users_table + ".id=" + dbconfig.charges_table + ".user_id " +
       "WHERE " + dbconfig.users_table + ".id=? AND " +
       dbconfig.users_table + ".date BETWEEN ? and ?";

    var data = [user.id, start_date, end_date];
    var rows = connection.query(getQuery, data, function (err, rows) {
        return callback(rows);
    });
};

charges.update = function(user, charge_id, category_id, callback){
    if(charge_id == undefined){
        return callback({"err": "charge.id is null", "errno": 2});
    }
    if(user == undefined || user.id == undefined){
        return callback({"err": "user or user.id is null", "errno": 2});
    }
    if(category_id != undefined){
        var updateQuery = "UPDATE " + dbconfig.charges_table +
          " SET category_id = ? WHERE id = ? AND user_id = ?";
        var results = connection.query(updateQuery, [category_id, charge_id, user.id], function(err, rows){
            return callback(rows);
        });
    } else {
        return callback({"err": "nothing to work with", "errno": 2});
    }
};

charges.saveTransactions = function (data, user, callback) {

    var transactions = data.transactions;
    var bank_id = data.bank_id;
    var account_id = data.account_id;
    var account_type = data.account_type;
    var user_id = user.id;

    function performQuery(data, callback) {
      var insertQuery = "INSERT IGNORE INTO " + dbconfig.charges_table + " (user_id, bank_id, account_id, account_type, " +
      "description, charge, memo, fitid, category_id, date, acc_balance) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
      connection.query(insertQuery, data, function(err, result) {
        if (err) { console.log(err); callback(null, null); }
        else { callback(null, result); }
      });
    }

    var totalSpent = 0, datas = [];
    for (var trans in transactions) {
        //console.log("Trans: " + trans + ", " + transactions[trans].MEMO[0] + ", " + parseFloat(transactions[trans].TRNAMT[0]));
        var trans = transactions[trans];
        //var fitid = parseInt(trans.FITID[0].replace("_", ""));
        var fitid = trans.FITID[0];
        var trnamt = parseFloat(trans.TRNAMT[0]);
        var date = trans.DTPOSTED[0].substr(0, 8);
            date = date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
        var memo = _.get(trans, "NAME[0]") || _.get(trans, "MEMO[0]");
        var acc_bal = parseFloat(_.get(trans, "USERS.STMT[0].TRNBAL[0]", "0"));

        var data = [user_id, bank_id, account_id, account_type, memo, trnamt, memo, fitid, 0, date, acc_bal];
        datas.push(data);

        totalSpent += trnamt;
    }

    async.map(datas, performQuery, function(err, results) {
      if (err) {
        console.log(err);
      }
      callback(totalSpent);
    });
}




module.exports = charges;
