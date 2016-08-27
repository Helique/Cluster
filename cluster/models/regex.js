var mysql = require('mysql');
var dbconfig = require('../config/credentials/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

var regex = {};
regex.create = function(regex, category_name, callback){
    if(category_name == undefined){
        return callback({"err": "category_name is null", "errno": 2});
    }
    //var insertQuery = "INSERT INTO " + dbconfig.categories_table + " (category_name) VALUES (?) ON DUPLICATE KEY IGNORE";
    var insertQuery = "INSERT IGNORE INTO " + dbconfig.regex_table + " (regex, category_name) VALUES (?,?)";
    var results = connection.query(insertQuery, [regex, category_name], function(err, rows){
        console.log(err);
        callback(callback({regex: regex, id: rows.insertId}));
    });
};

regex.get = function(regex, category_name, callback){
    if(category_name == undefined){
        var rows = connection.query("SELECT * FROM " + dbconfig.regex_table, null, function (err, rows) {
            return callback(rows);
        });
    } else {
        var rows = connection.query("SELECT * FROM " + dbconfig.regex_table + " WHERE category_name = ?", [category_name], function (err, rows) {
            return callback(rows);
        });
    }
};

regex.update = function(id, regex, callback){
    if(regex == undefined){
        return callback({"err": "regex is null", "errno": 2});
    }
    var updateQuery = "UPDATE " + dbconfig.regex_table + " SET regex = ? WHERE id = ?";
    var results = connection.query(updateQuery, [regex, id], function(err, rows){
        callback(rows);
    });
};

regex.deleteRegex = function(id, callback){
    if(id == undefined){
        return callback({"err": "id is null", "errno": 2});
    } else {
        var insertQuery = "DELETE FROM " + dbconfig.regex_table + " WHERE  id = ?";
        var results = connection.query(insertQuery, [id], function(err, rows){
            return callback(rows);
        });
    }
};

regex.deleteAll = function(category_name, callback){
    if(category_name == undefined){
        return callback({"err": "category_name is null", "errno": 2});
    } else {
        var insertQuery = "DELETE FROM " + dbconfig.regex_table + " WHERE  category_name = ?";
        var results = connection.query(insertQuery, [category_name], function(err, rows){
            return callback(rows);
        });
    }
};

module.exports = regex;

