var express = require('express');

var fs = require('fs');

var charge_model = require("../models/charges");
var user_model = require("../models/users");
var transactionProcessor = require("../helpers/transactions/processor")


module.exports = function(upload) {

  var router = express.Router();

  router.post('/qfx', user_model.mustBeLoggedIn, upload.single('QFX_File'), function(req, res) {
    fs.readFile(req.file.path, function(err, buffer) {
      if (err) {
        console.log(err);
        return res.end("something went wrong");
      }

      transactionProcessor.parseQFX(buffer, function(err, transactions) {
        if (err) {
          console.log(err);
          return res.end("something went wrong");
        }
        charge_model.saveTransactions(transactions, req.user, function(totalSpent) {
          res.end("" + totalSpent);
        });
      });
    })
  });

  return router;

};
