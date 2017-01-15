var dbconfig = require('../../config/credentials/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var exec = require('child_process').exec;

var bank_data = dbconfig.banks["Mechanics Bank"];


// TODO worry about concurrency issues
function updateTransactions(user) {
  connection.query("SELECT id,collection_count FROM " +
    dbconfig.database + '.' + dbconfig.bank_accounts_table + " WHERE user_id=? AND bank_id=?",
    [user.id, bank_data.id], function(err, results) {
      var count = results[0].collection_count;
      var bankAccountId = results[0].id;
      var cmd = './helpers/transactions/scripts/getTransactionsMechanics.sh ' + count;

      exec(cmd, function(error, stdout, stderr) {
        console.log(error, stdout, stderr, results[0]);
        connection.query("UPDATE " + dbconfig.database + '.' + dbconfig.bank_accounts_table +
          " SET collection_count = collection_count + 1 WHERE id=?", [bankAccountId], function(err, results) {
            console.log(err, results);
          });
      });

    });
}

module.exports = {
  updateTransactions: updateTransactions
};
