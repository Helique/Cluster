var express = require('express');
var router = express.Router();

/* GET home page */

router.get('/', function(req, res, next){
	res.render('index.nunjucks');
	//res.json({result: "result"});
});

module.exports = router;