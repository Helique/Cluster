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
    
    //remove header of file that breaks xml2js
    for(i = 0; data[i] != 60; i++){
        data[i] = 32;
    }
    
    parser.parseString(data, function (err, result) {
        console.log(err);
        console.log("file location:" + __dirname);
        var transactions = result.OFX.BANKMSGSRSV1[0].STMTTRNRS[0].STMTRS[0].BANKTRANLIST[0].STMTTRN;
        console.dir("Number of transactions: " + transactions.length);
        var totalSpent = 0;
        for(var trans in transactions){
            console.log("Trans: "+ trans +", " + transactions[trans].MEMO[0] +", " + parseFloat(transactions[trans].TRNAMT[0]));
            totalSpent +=  parseFloat(transactions[trans].TRNAMT[0]);
            var fitid = parseInt(transactions[trans].FITID[0].replace("_", ""));
            //console.log(parseInt(transactions[trans].FITID[0].replace("_", "")));
            var date = transactions[trans].DTPOSTED[0].substr(0,8);
            date = date.slice(0,4)+"-"+ date.slice(4,6) +"-"+ date.slice(6,8);
            //console.log(transactions[trans]["USERS.STMT"][0].TRNBAL[0]);
            var insertQuery = "INSERT IGNORE INTO " + dbconfig.charges_table + " (description, charge, memo, " +
                "fitid, category_id, date, acc_balance) VALUES (?,?,?,?,?,?,?)";
            var results = connection.query(insertQuery, [transactions[trans].MEMO[0],
                        parseFloat(transactions[trans].TRNAMT[0]),
                        transactions[trans].MEMO[0],
                        fitid,
                        0,
                        date,
                        parseFloat(transactions[trans]["USERS.STMT"][0].TRNBAL[0])
                    ],
                    function(err, rows){
                        console.log(err);
                    }
            );
        }
        console.log ("Total spent: " + totalSpent);
        console.log("Error");
        console.log(err);
        console.log('Done');
        connection.end();
    });
});

