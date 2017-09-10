var expect = require("chai").expect
var dbconfig = require('../config/credentials/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var init_db = require('../scripts/initialize_database');

describe("Database Creator", function(){
  it("Drops an old Database", function(done){
    var query = "DROP DATABASE " + dbconfig.database + ";";
    connection.query(query, [], function(err, rows) {
      done();
    });
  });

  it("Creates a new one.", function(done){
    connection.query('CREATE DATABASE ' + dbconfig.database, function(err, results) {
      if (err) {
        return console.log(err);
      }
      console.log("Database created successfully");
      connection.end();

      init_db(function(err, result) {
        if (err) console.log(err);
        else console.log("Database initialized successfully");
        done();
      });
    });
  });
});
