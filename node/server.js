/**
 * Satellizer Node.js Example
 * (c) 2015 Sahat Yalkabov
 * License: MIT
 */

var path = require('path');
//var qs = require('querystring');

// var async = require('async');
// var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
//var jwt = require('jwt-simple');
//var moment = require('moment');
//var mongoose = require('mongoose');
//var request = require('request');

var config = require('./config');
//var db = require('./mongodb');

//var User = db.User();
var auth = require('./auth');
var api = require('./api');

var app = express();

app.set('port', process.env.PORT || 9000);
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

auth.init(app);
api.init(app);

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}
console.log(__dirname)
app.use(express.static(path.join(__dirname, '../client')));

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
