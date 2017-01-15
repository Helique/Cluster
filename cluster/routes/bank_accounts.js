var express = require('express');

var fs = require('fs');

var charge_model = require("../models/charges");
var user_model = require("../models/users");
var transactionProcessor = require("../helpers/transactions/processor");
var bankAccounts = require("../models/bank_accounts");


var router = express.Router();

router.post('/add', user_model.mustBeLoggedIn, function(req, res) {
  var postData = req.body;
  bankAccounts.add(req.user, postData, function(err, result) {
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    }
    res.end();
  });
});

router.get("/getAll", user_model.mustBeLoggedIn, function(req, res) {
  bankAccounts.getAll(req.user, function(err, results) {
    if (err) {
      console.log(err);
      return res.end("Something went wrongo");
    }
    res.json(results);
  })
});

router.get("/update", function(req, res) {
  bankAccounts.update(req.user, function(err, results) {
    if (err) {
      console.log(err);
      return res.end("Something went wrongo");
    }
    res.json(results);
  })
});

module.exports = router;
