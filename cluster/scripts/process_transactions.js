/**
 * Created by david.bernadett on 7/10/16.
 */
var fs = require('fs'), xml2js = require('xml2js');
var parser = new xml2js.Parser();
var mysql = require('mysql');
var dbconfig = require('../config/credentials/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

function saveTransactions(transactions){
    var totalSpent = 0;
    for (var trans in transactions) {
        //console.log("Trans: " + trans + ", " + transactions[trans].MEMO[0] + ", " + parseFloat(transactions[trans].TRNAMT[0]));
        var trans = transactions[trans];
        var fitid = parseInt(trans.FITID[0].replace("_", ""));
        var trnamt = parseFloat(trans.TRNAMT[0]);
        var date = trans.DTPOSTED[0].substr(0, 8);
            date = date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
        var memo = trans.MEMO[0];
        var acc_bal = parseFloat(trans["USERS.STMT"][0].TRNBAL[0]);

        totalSpent += trnamt;

        var insertQuery = "INSERT IGNORE INTO " + dbconfig.charges_table + " (description, charge, memo, " +
            "fitid, category_id, date, acc_balance) VALUES (?,?,?,?,?,?,?)";
        var results = connection.query(insertQuery, [memo,
             trnamt,
             memo,
             fitid,
             0,
             date,
             acc_bal
             ],
             function (err, rows) {
             }
         );
    }
    return totalSpent;
}

function convertToJSON(xml_data){
    parser.parseString(xml_data, function (err, result) {
        console.log(err);
        console.log("file location:" + __dirname);
        var transactions = result.OFX.BANKMSGSRSV1[0].STMTTRNRS[0].STMTRS[0].BANKTRANLIST[0].STMTTRN;
        console.dir("Number of transactions: " + transactions.length);
        var totalSpent = saveTransactions(transactions);

        console.log("Total spent: " + totalSpent);
        console.log(err);
        console.log('Done');
    });
}



fs.readdir(__dirname + '/../transactions', function(err, files) {
    console.log(files);
    for(file in files) {
        file = files[file];
        var stringEndsWithQfx = (file.indexOf(".qfx", file.length - ".qfx".length) !== -1);
        console.log(stringEndsWithQfx);
        if(stringEndsWithQfx) {
            var fileBuffer = fs.readFileSync(__dirname + '/../transactions/' + file);
            console.log(fileBuffer);

            //remove header of file that breaks xml2js
            for (i = 0; fileBuffer[i] != 60; i++) {
                fileBuffer[i] = 32;
            }
            convertToJSON(fileBuffer);
        }
    }
    connection.end();
});

