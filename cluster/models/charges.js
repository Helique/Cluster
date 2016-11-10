/**
 * Created by david.bernadett on 7/5/16.
 */
var mysql = require('mysql');
var async = require('async');
var dbconfig = require('../config/credentials/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
var charges = {};


charges.get = function(callback){
    var getQuery = "SELECT "+ dbconfig.charges_table +".*, " + dbconfig.categories_table + ".category_name FROM " + dbconfig.charges_table + " LEFT JOIN " + dbconfig.categories_table +
        " ON "+dbconfig.charges_table+".category_id="+ dbconfig.categories_table+".id";
    var rows = connection.query(getQuery, [], function (err, rows) {
        return callback(rows);
    });
};

charges.getRange = function(start_date, end_date, callback){
    var rows = connection.query("SELECT * FROM " + dbconfig.charges_table + " WHERE `date` BETWEEN ? and ?", [start_date, end_date], function (err, rows) {
        return callback(rows);
    });
};

charges.update = function(charge_id, category_id, callback){
    if(charge_id == undefined){
        return callback({"err": "charge.id is null", "errno": 2});
    }
    if(category_id != undefined){
        var updateQuery = "UPDATE " + dbconfig.charges_table + " SET category_id = ? WHERE id = ?";
        var results = connection.query(updateQuery, [category_id, charge_id], function(err, rows){
            return callback(rows);
        });
    } else {
        return callback({"err": "nothing to work with", "errno": 2});
    }
};

charges.saveTransactions = function (transactions, callback) {

    function performQuery(data, callback) {
      var insertQuery = "INSERT IGNORE INTO " + dbconfig.charges_table + " (description, charge, memo, " +
          "fitid, category_id, date, acc_balance) VALUES (?,?,?,?,?,?,?)";
      connection.query(insertQuery, data, callback);
    }

    var totalSpent = 0, datas = [];
    for (var trans in transactions) {
        //console.log("Trans: " + trans + ", " + transactions[trans].MEMO[0] + ", " + parseFloat(transactions[trans].TRNAMT[0]));
        var trans = transactions[trans];
        var fitid = parseInt(trans.FITID[0].replace("_", ""));
        var trnamt = parseFloat(trans.TRNAMT[0]);
        var date = trans.DTPOSTED[0].substr(0, 8);
            date = date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
        var memo = trans.MEMO[0];
        var acc_bal = parseFloat(trans["USERS.STMT"][0].TRNBAL[0]);

        var data = [memo, trnamt, memo, fitid, 0, date, acc_bal];
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
