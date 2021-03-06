var express = require('express');
var bodyParser = require('body-parser');

var config = require(__base + 'config');
var logger = require(__base + 'bin/logger');
var error = require(__base + 'app/misc/error');

logger.info('Initializing app ...');

var app = express();

//Setting middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Setting custom middleware
var authorizationMiddleware = require(__base + 'app/middleware/authorization');
app.use(authorizationMiddleware);

//Setting routes
var ping = require(__base + 'app/route/ping');
var user = require(__base + 'app/route/v1/user');
var userFacebook = require(__base + 'app/route/v1/user/facebook');

app.use('/ping', ping);
app.use('/v1/user', user);
app.use('/v1/user/facebook', userFacebook);


// 404 error
app.use(function(req, res, next) {
  /*var err = new Error('Not Found');
  err.status = 404;*/

  logger.info('404 not found : ' + req.baseUrl + req.url);

  next(error.notFoundError);
});

//Error handler
app.use(function(err, req, res, next) {

  if (err.status == 500 && err.stack) {
    logger.error(req.baseUrl);
    logger.error(err.stack);
    err = error.internalServerError;
  }
  else {
    logger.info('Replying [' + err.status + '] : ' + err.message);
  }
  res.status(err.status || 500);
  res.send({status: err.status, error: err.message});
});

module.exports = app;