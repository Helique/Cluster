var express = require('express');
var multer  =   require('multer');
var router = express.Router();
var fs = require('fs');

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

var userAuthRouter = require("./user_auth");

var category_model = require("../models/categories");
var charge_model = require("../models/charges");
var regex_model = require("../models/regex");
var user_model = require("../models/users");
var upload = multer({ storage : storage});
var uploadUserPhoto = upload.single('userPhoto');

var chargesRouter = require('./charges')(upload);

router.use('/user', userAuthRouter);
router.use('/charges', chargesRouter);

router.post('/photo',function(req,res){
    uploadUserPhoto(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        console.log(req.file);
        res.end("File is uploaded");
    });
});

router.get('/charge', user_model.mustBeLoggedIn, function(req, res, info){
    if(req.query.start_date != undefined && req.query.end_date != undefined) {
        charge_model.getRange(req.user, req.query.start_date, req.query.end_date, function (response) {
            res.json(response);
        });
    } else {
        charge_model.get(req.user, function (response) {
            res.json(response);
        });
    }
});

router.post('/charge',function(req, res, info){
    if(req.body.id){
        charge_model.update(req.body.id, req.body.category_id, function(response){
            res.json(response);
        });
    } else {
    //    category_model.create(req.body.category_name, function(response){
        res.json({error:"something was off"});
      //  });
    }
});

router.get('/category',function(req,res){
    category_model.get(req.body.category_name, function(response){
        res.json(response);
    });
});

router.post('/category',function(req, res, info){
    if(req.body.id){
        category_model.update(req.body.id, req.body.category_name, function(response){
            res.json(response);
        });
    } else {
        category_model.create(req.body.category_name, function(response){
            res.json(response);
        });
    }
});

router.get('/category/:category_name/regex',function(req,res){
    regex_model.get(null, req.params.category_name, function(response){
        res.json(response);
    });
});

router.delete('/category/:category_name',function(req,res){
    regex_model.deleteAll(req.params.category_name, function(response){
        category_model.delete(req.params.category_name, function(response){
            res.json(response);
        });
    });
});

router.post('/category/:category_name/regex',function(req,res){
    if(req.body.id == undefined) {
        regex_model.create(req.body.regex, req.params.category_name, function (response) {
            res.json(response);
        });
    } else {
        regex_model.update(req.body.id, req.body.regex, function (response) {
            res.json(response);
        });
    }
});

router.delete('/category/:category_name/regex/:regex_id',function(req,res){
    regex_model.deleteRegex(req.params.regex_id, function(response){
        res.json(response);
    });
});

router.get('/file', function(req,res){

});

module.exports = router;
