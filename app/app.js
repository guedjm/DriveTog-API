var express = require('express');
var bodyParser = require('body-parser');

var config = require(__base + 'config');
var logger = require(__base + 'bin/logger');

logger.info('Initializing app ...');

var app = express();

//Setting middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Setting routes
var ping = require(__base + 'app/route/ping');

app.use('/ping', ping);


// 404 error
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Error handler
app.use(function(err, req, res, next) {
  logger.error(req.baseUrl);
  logger.error(err.stack);
  res.status(err.status || 500);
  res.send();
});

module.exports = app;