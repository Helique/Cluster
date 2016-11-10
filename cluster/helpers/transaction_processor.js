/**
 * Modified by porter.haet on 11/9/16.
 */
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

function parseQFX(xml_data, callback){
    parser.parseString(xml_data, function (err, result) {
        if (err) {
          return callback(err);
        }
        var transactions = result.OFX.BANKMSGSRSV1[0].STMTTRNRS[0].STMTRS[0].BANKTRANLIST[0].STMTTRN;
        console.dir("Number of transactions: " + transactions.length);
        callback(null, transactions);
    });
}

module.exports = {
  parseQFX: parseQFX
}
