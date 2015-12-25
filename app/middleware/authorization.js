var logger = require(__base + 'bin/logger');
var clientModel = require(__base + 'app/model/client');
var userModel = require(__base + 'app/model/user');
var error = require(__base + 'app/misc/error');

function authenticateRequest(req, res, next) {

  //Log request ?

  logger.info('Received a request : ' + req.method + ' ' + req.baseUrl + req.url);
  req.authType = 'none';

  if (req.get('Authorization') == undefined) {
    logger.info('No Authorization in header');
    next();
  }
  else {
    logger.info('Authorization header is ' + req.get('Authorization'));

    var authParam = req.get('Authorization').split(' ');

    if (authParam.length != 2) {
      next();
    }
    else {
      if (authParam[0] == 'Basic') {
        authenticateClient(authParam, function (err, client) {
          if (err) {
            next(err);
          }
          else if (client == null) {
            next();
          }
          else {
            req.authType = 'client';
            req.authClient = client;
            next();
          }
        });
      }
      else if (authParam[1] == 'Bearer') {
        authenticateUser(authParam, function (err, client, user, token) {
          if (err) {
            next(err);
          }
          else if(client == null || user == null || token == null) {
            next();
          }
          else {
            req.authClient = token.client;
            req.authUser = token.user;
            req.authToken = token;
            req.authType = 'user';
            next();
          }
        });
      }
      else {
        next();
      }
    }
  }
}

function authenticateClient(authParam, cb) {

  logger.info('Authenticating client ...');

  clientModel.authenticateClientBySecret(authParam[1], function (err, client) {
    if (err) {
      logger.error('Unable to get client');
      cb(err, null);
    }
    else if(client != undefined) {
      logger.info('Client is ' + client.applicationName);
      cb(null, client);
    }
    else {
      logger.info('Invalid client');
      cb(null, null);
    }
  });
}

function authenticateUser(authParam, cb) {

  logger.info('Authenticating user ...');

  userModel.getToken(authParam[1], function (err, token) {
    if (err) {
      logger.error('Unable to get token');
      cb(err, null, null);
    }
    else if (token != undefined && token.client.activated == true) {
      logger.info('User is ' + token.user._id);
      logger.info('Client is ' + token.client.applicationName);
      cb(null, token.client, token.user, token);
    }
    else {
      logger.info('Invalid Bearer token');
      cb(null, null, null, null);
    }
  });
}

module.exports = authenticateRequest;