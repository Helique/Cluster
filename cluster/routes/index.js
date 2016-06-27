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

router.get('/xml',function(req,res){
    var parseString = require('xml2js').parseString;
    var xml = "<root>Hello xml2js!</root>"
    parseString(xml, function (err, result) {
        console.dir(result);
    });
    res.end("xml called!");
});

router.post('/category',function(req,res){
    res.end("post category called!");
});

router.delete('/category',function(req,res){
    res.end("delete category called!");
});

router.get('/category',function(req,res){
    res.end("get category called!");
});

router.post('/category/regex',function(req,res){
    res.end("post regex called!");
});

router.delete('/category/regex',function(req,res){
    res.end("delete regex called!");
});




router.get('/file', function(req,res){
    var parser = new xml2js.Parser();
    fs.readFile(__dirname + '/may.qfx', function(err, data) {
        parser.parseString(data, function (err, result) {
            console.log("file location:" + __dirname);
            var transactions = result.OFX.BANKMSGSRSV1[0].STMTTRNRS[0].STMTRS[0].BANKTRANLIST[0].STMTTRN;
            console.dir("Number of transactions: " + transactions.length);
            var totalSpent = 0;
            for(var trans in transactions){
                console.log("Trans: "+ trans +", " + transactions[trans].MEMO +", " + parseFloat(transactions[trans].TRNAMT[0]));
                totalSpent +=  parseFloat(transactions[trans].TRNAMT[0]);
            }
            console.log ("Total spent: " + totalSpent);
            console.log("Error");
            console.log(err);
            console.log('Done');
        });
    });
    res.json("{fuck}");
});




module.exports = router;