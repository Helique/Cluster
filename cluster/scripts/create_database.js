/**
 * Created by david.bernadett on 6/26/16.
 */

var mysql = require('mysql');
var async = require('async');
var dbconfig = require('../config/credentials/database');
var init_db = require('./initialize_database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database, function(err, results) {
  if (err) {
    return console.log(err);
  }
  console.log("Database created successfully");
  connection.end();

  init_db(function(err, result) {
    if (err) console.log(err);
    else console.log("Database initialized successfully");
    process.exit();
  });
});
