var express = require('express');
var multer  =   require('multer');
var router = express.Router();
var fs = require('fs'),
    xml2js = require('xml2js');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var category_model = require("../models/categories");
var request = require('request');
var casper = require('casper').create();

var upload = multer({ storage : storage}).single('userPhoto');
/* GET home page */

router.get('/', function(req, res, next){
	res.render('index.nunjucks');
	//res.json({result: "result"});
});

router.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

router.get('/login',function(req,res){
    casper.start('http://casperjs.org/');
    casper.then(function() {
        console.log('First Page: ' + this.getTitle());
    });
    casper.run();
    res.end("thing has been run");
});

router.get('/api/1.0/charge',function(req, res, info){
    category_model.get(function(response){
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

router.get('/api/1.0/category',function(req,res){
    category_model.get(req.body.category_name, function(response){
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