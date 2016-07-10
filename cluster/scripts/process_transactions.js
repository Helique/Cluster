/**
 * Created by david.bernadett on 7/10/16.
 */
var fs = require('fs'), xml2js = require('xml2js');
var parser = new xml2js.Parser();
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

fs.readFile(__dirname + '/../transactions/2016_7_10_4_39_34.qfx', function(err, data) {
    console.log(data);
    //data = data.substr(data.indexOf("<"));
    for(i = 0; data[i] != 60; i++){
        data[i] = 32;
    }
    //console.log(data.substring(20));
    parser.parseString(data, function (err, result) {
        console.log(err);
        console.log("file location:" + __dirname);
        var transactions = result.OFX.BANKMSGSRSV1[0].STMTTRNRS[0].STMTRS[0].BANKTRANLIST[0].STMTTRN;
        console.dir("Number of transactions: " + transactions.length);
        var totalSpent = 0;
        for(var trans in transactions){
            console.log("Trans: "+ trans +", " + transactions[trans].MEMO +", " + parseFloat(transactions[trans].TRNAMT[0]));
            totalSpent +=  parseFloat(transactions[trans].TRNAMT[0]);
        }
        console.log ("Total spent: " + totalSpent);
        console.log("Error");
        console.log(err);
        console.log('Done');
    });
});
