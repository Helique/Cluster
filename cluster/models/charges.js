/**
 * Created by david.bernadett on 7/5/16.
 */
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
var charges = {};


charges.get = function(callback){
    console.log(category_name);
    if(category_name == undefined){
        var rows = connection.query("SELECT * FROM " + dbconfig.categories_table, null, function (err, rows) {
            return callback(rows);
        });
    } else {
        var rows = connection.query("SELECT * FROM " + dbconfig.categories_table + " WHERE category_name = ?", [category_name], function (err, rows) {
            return callback(rows);
        });
    }
};

module.exports = charges;