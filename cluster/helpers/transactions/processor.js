/**
 * Modified by porter.haet on 11/9/16.
 */
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

function parseQFX(xml_buffer, callback){
    for (var i = 0; xml_buffer[i] != 60 && i < xml_buffer.length; i++) {
      xml_buffer[i] = 32;
    }
    xml = xml_buffer.toString();
    xml = xml
              // Remove empty spaces and line breaks between tags
              .replace(/>\s+</g, '><')
              // Remove empty spaces and line breaks before tags content
              .replace(/\s+</g, '<')
              // Remove empty spaces and line breaks after tags content
              .replace(/>\s+/g, '>')
              // Remove dots in start-tags names and remove end-tags with dots
              .replace(/<([A-Z0-9_]*)+\.+([A-Z0-9_]*)>([^<]+)(<\/\1\.\2>)?/g, '<\$1\$2>\$3' )
              // Add a new end-tags for the ofx elements
              .replace(/<(\w+?)>([^<]+)/g, '<\$1>\$2</<added>\$1>')
              // Remove duplicate end-tags
              .replace(/<\/<added>(\w+?)>(<\/\1>)?/g, '</\$1>');

    parser.parseString(xml, function (err, result) {
        if (err) {
          return callback(err);
        }
        var transactions = result.OFX.BANKMSGSRSV1[0].STMTTRNRS[0].STMTRS[0].BANKTRANLIST[0].STMTTRN;
        var bank_info = result.OFX.BANKMSGSRSV1[0].STMTTRNRS[0].STMTRS[0].BANKACCTFROM[0];
        var bank_id = parseInt(bank_info.BANKID[0]);
        var account_id = parseInt(bank_info.ACCTID[0]);
        var account_type = bank_info.ACCTTYPE[0];

        callback(null, {
          transactions: transactions,
          bank_id: bank_id,
          account_id: account_id,
          account_type: account_type
        });
    });
}

module.exports = {
  parseQFX: parseQFX
}
