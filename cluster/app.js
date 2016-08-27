//set variables for environment
var express = require('express');
var app = express();
var path = require('path');
var api_v1 = require('./routes/api.1.0');
var front_end = require('./routes/front_end');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');

nunjucks.configure('views', {
	autoescape: true,
	express: app,
	watch: true
});

//allow us to recieve json data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Our Routes
app.use("/api/1.0", api_v1);
app.use("/static", express.static("public"));
app.use("/angular", express.static("node_modules/angular"));
app.use("/angular-route", express.static("node_modules/angular-route"));
app.use("/", front_end);
//views as directory for all template files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');

// instruct express to serve up static assets
app.use(express.static('public'));
module.exports = app;
