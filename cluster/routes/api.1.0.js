var express = require('express');
var multer  =   require('multer');
var router = express.Router();
var fs = require('fs');

var category_model = require("../models/categories");
var charge_model = require("../models/charges");
var regex_model = require("../models/regex");
var upload = multer({ storage : storage}).single('userPhoto');

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

router.post('/api/1.0/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

router.get('/api/1.0/charge',function(req, res, info){
    if(req.query.start_date != undefined && req.query.end_date != undefined) {
        charge_model.getRange(req.query.start_date, req.query.end_date, function (response) {
            res.json(response);
        });
    } else {
        charge_model.get(function (response) {
            res.json(response);
        });
    }
});

router.get('/api/1.0/category',function(req,res){
    category_model.get(req.body.category_name, function(response){
        res.json(response);
    });
});

router.post('/api/1.0/category',function(req, res, info){
    category_model.create(req.body.category_name, function(response){
        res.json(response);
    });

});

router.delete('/api/1.0/category',function(req,res){
    category_model.delete(req.body.category_name, function(response){
        res.json(response);
    });
});

router.post('/api/1.0/category/regex',function(req,res){
    res.end("post regex called!");
});

router.delete('/api/1.0/category/regex',function(req,res){
    res.end("delete regex called!");
});

router.get('/file', function(req,res){
    
});

module.exports = router;