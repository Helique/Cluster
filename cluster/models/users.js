/**
 * Created by porter.haet on 11/5/16.
 */
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var dbconfig = require('../config/credentials/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

var errors = {
  userNotFound: {error: "User not found."},
  emailInUse: {error: "Email already in use."},
  usernameInUse: {error: "Username already in use."}
}

function rowsToUser(rowData){
  user = {}
  if(rowData.hasOwnProperty('id')){
    user.id = rowData.id
  }
  if(rowData.hasOwnProperty('email')){
    user.email = rowData.email
  }
  if(rowData.hasOwnProperty('name')){
    user.name = rowData.name
  }
  if(rowData.hasOwnProperty('createdOn')){
    user.createdOn = rowData.createdOn
  }
  if(rowData.hasOwnProperty('passhash')){
    user.passhash = rowData.passhash
  }
  return user
}

function getAll(callback){
    var query = "SELECT * FROM " + dbconfig.users_table;
    connection.query(query, [], function (err, rows) {
        callback(rows);
    });
};

function findById(id, callback) {
  var query = "SELECT * FROM " + dbconfig.users_table + " WHERE id=? LIMIT 1";
  connection.query(query, [id], function(err, rows) {
    if(rows.length > 0){
      callback(rowsToUser(rows[0]));
    } else {
      callback(errors.userNotFound)
    }
  });
}

function findByUsername(username, callback) {
  var query = "SELECT * FROM " + dbconfig.users_table + " WHERE name=? LIMIT 1;";
  connection.query(query, [username], function(err, rows) {
    if(rows.length > 0){
      callback(rowsToUser(rows[0]));
    } else {
      callback(errors.userNotFound)
    }
  });
}

function newUser(username, password, email, callback) {
  var insertQuery = "INSERT INTO " + dbconfig.users_table + " (name, passhash, email) " +
    "VALUES (?, ?, ?);";
  bcrypt.hash(password, 8, function(err, hash) {
    connection.query(insertQuery, [username, hash, email], function(err, rows) {
      if (err) {
        if(err.message.search("name_UNIQUE") > 0){
          callback(errors.usernameInUse);
        }else if(err.message.search("email_UNIQUE") > 0){
          callback(errors.emailInUse);
        }
      } else {
        callback({id: rows.insertId});
      }
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
  mustBeLoggedIn: mustBeLoggedIn,
  errors: errors
};
