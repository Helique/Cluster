/**
 * Created by david on 1/15/17.
 */
var dbconfig = require('../config/credentials/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
//var transactionsManager = require("/../helpers/transactions/manager")
var banks = {}

banks.getSupported =  function(callback) {
    // SELECT bankAccounts.* FROM bankAccounts INNER JOIN users ON bankAccounts.user_id=?
    console.log("SELECT * FROM " + dbconfig.database + "." +
        dbconfig.banks_table);

    connection.query("SELECT * FROM " + dbconfig.database + "." +
        dbconfig.banks_table, callback);
}

module.exports = banks;