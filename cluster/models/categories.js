var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

var categories = {};
categories.create = function(category_name, callback){
    console.log(category_name);
    if(category_name == undefined){
        return callback({"err": "category_name is null", "errno": 2});
    }
    //var insertQuery = "INSERT INTO " + dbconfig.categories_table + " (category_name) VALUES (?) ON DUPLICATE KEY IGNORE";
    var insertQuery = "INSERT IGNORE INTO " + dbconfig.categories_table + " (category_name) VALUES (?)";
    var results = connection.query(insertQuery, [category_name], function(err, rows){
        console.log(err);
        callback({"status": "category added"});
    });
};

categories.get = function(category_name, callback){
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

categories.delete = function(category_name, callback){
    console.log(category_name);
    if(category_name == undefined){
        return callback({"err": "category_name is null", "errno": 2});
    } else {
        var insertQuery = "DELETE FROM " + dbconfig.categories_table + " WHERE  category_name = ?";
        var results = connection.query(insertQuery, [category_name], function(err, rows){
            return callback(rows);
        });
    }
};

module.exports = categories;
