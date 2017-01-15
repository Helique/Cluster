/**
 * Created by david on 1/15/17.
 */
var express = require('express');

var fs = require('fs');

var charge_model = require("../models/charges");
var user_model = require("../models/users");
var transactionProcessor = require("../helpers/transactions/processor");
var banks = require("../models/banks");

var router = express.Router();

router.get("/getSupported", function(req, res) {
    banks.getSupported(function(err, results) {
        if (err) {
            console.log(err);
            return res.end("Something went wrongo");
        }
        res.json(results);
    })
});

module.exports = router;