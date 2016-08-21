/**
 * Created by david.bernadett on 7/5/16.
 */
var mysql = require('mysql');
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




module.exports = charges;