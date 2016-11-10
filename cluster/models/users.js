/**
 * Created by porter.haet on 11/5/16.
 */
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var dbconfig = require('../config/credentials/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);


function getAll(callback){
    var query = "SELECT * FROM " + dbconfig.users_table;
    connection.query(query, [], function (err, rows) {
        callback(rows);
    });
};

function findById(id, callback) {
  var query = "SELECT * FROM " + dbconfig.users_table + " WHERE id=? LIMIT 1";
  connection.query(query, [id], function(err, rows) {
    callback(rows[0]);
  });
}

function findByUsername(username, callback) {
  var query = "SELECT * FROM " + dbconfig.users_table + " WHERE name=? LIMIT 1;";
  connection.query(query, [username], function(err, rows) {
    callback(rows[0]);
  });
}

function newUser(username, password, email, callback) {
  var insertQuery = "INSERT INTO " + dbconfig.users_table + " (name, passhash, email) " +
    "VALUES (?, ?, ?);";

  bcrypt.hash(password, 8, function(err, hash) {
    connection.query(insertQuery, [username, hash, email], function(err, rows) {
      if (err) {
        console.log(err);
      }
      callback({id: rows.insertId});
    });
  });
}

function mustBeLoggedIn(req, res, next) {
  if (!req.user) {
    res.status(401);
    return res.end("Unauthorized");
  }
  next();
}

module.exports = {
  getAll: getAll,
  findById: findById,
  findByUsername: findByUsername,
  newUser: newUser,
  mustBeLoggedIn: mustBeLoggedIn
};
