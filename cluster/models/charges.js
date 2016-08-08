/**
 * Created by david.bernadett on 7/5/16.
 */
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
var charges = {};


charges.get = function(callback){
    var rows = connection.query("SELECT * FROM " + dbconfig.charges_table, null, function (err, rows) {
        return callback(rows);
    });
};

charges.getRange = function(start_date, end_date, callback){
    var rows = connection.query("SELECT * FROM " + dbconfig.charges_table + " WHERE `date` BETWEEN ? and ?", [start_date, end_date], function (err, rows) {
        return callback(rows);
    });
};

module.exports = charges;