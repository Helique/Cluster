/**
 * Created by david.bernadett on 6/26/16.
 */

var mysql = require('mysql');
var async = require('async');
var dbconfig = require('../config/credentials/database');

var connection = mysql.createConnection(dbconfig.connection);

function setupBanks(callback) {
  var banks = Object.keys(dbconfig.banks);

  var addBanks = banks.map(function(bank) {
    return function(callback) {
      bank_data = dbconfig.banks[bank];
      connection.query(`INSERT IGNORE INTO ` + dbconfig.database + '.' + dbconfig.banks_table +
        ` (id, name) VALUES (?, ?)`, [bank_data.id, bank_data.name], callback);
    }
  });

  async.parallel(addBanks, function(err, results) {
    connection.end();
    callback(err, results);
  });
}

setupBanks(function(err, result) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("Banks updated");
  }
});
