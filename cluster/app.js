//set variables for environment
var express = require('express');
var app = express();
var path = require('path');
var routes = require('./routes/index');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');

//set routes

nunjucks.configure('views', {
	autoescape: true,
	express: app,
	watch: true
});

//allow us to recieve json data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", routes);
//app.use("/static", express.static("public"));
//views as directory for all template files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');



// instruct express to serve up static assets
app.use(express.static('public'));
module.exports = app;