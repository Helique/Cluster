//set variables for environment
var express = require('express');
var app = express();
var path = require('path');

//set routes
app.get('/', function(req, res){
	res.json({result: "result"});
});

//views as directory for all template files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// instruct express to serve up static assets
app.use(express.static('public'));
module.exports = app;