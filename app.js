var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// getting-started.js


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = (callback) => {
  var routes = require('./routes/index');
  var add = require('./routes/add');
  
  app.use('/', routes);
  app.use('/add', add);
};

var mongodb = (callback) => {
  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/test');
  
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // we're connected!
    
    db.schemas = {};
    db.schemas.card = mongoose.Schema({
    username: String
    , password: String
    });
    
    app.use(function (req, res, next) {
      req.db = { mongoose: mongoose };
      next();
    });
    
    return callback();
  });
};

var handleAppError = (callback) => {
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handlers
  
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }
  
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
  
  return callback();
};

var jobs = [routes, mongodb, handleAppError];
async.series(jobs, () => console.log("App loaded"));


module.exports = app;
