var mysql = require('mysql');
var dbconfig = require('../config/credentials/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

var categories = {};

categories.create = function(category_name, callback){
    if(category_name == undefined){
        return callback({"err": "category_name is null", "errno": 2});
    }
    //var insertQuery = "INSERT INTO " + dbconfig.categories_table + " (category_name) VALUES (?) ON DUPLICATE KEY IGNORE";
    var insertQuery = "INSERT IGNORE INTO " + dbconfig.categories_table + " (category_name) VALUES (?)";
    var results = connection.query(insertQuery, [category_name], function(err, rows){
        callback({category_name: category_name, id: rows.insertId});
    });
};

categories.update = function(id, category_name, callback){
    if(category_name == undefined){
        return callback({"err": "category_name is null", "errno": 2});
    }
    var updateQuery = "UPDATE " + dbconfig.categories_table + " SET category_name = ? WHERE id = ?";
    var results = connection.query(updateQuery, [category_name, id], function(err, rows){
        callback(rows);
    });
};

categories.get = function(category_name, callback){
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

