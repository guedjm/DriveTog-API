var logger = require(__base + 'bin/logger');
var clientModel = require(__base + 'app/model/client');
var userModel = require(__base + 'app/model/user');


function authenticateRequest(req, res, next) {

  //Log request ?

  logger.info('Received a request : ' + req.method + ' ' + req.baseUrl + req.url);

  if (req.get('Authorization') == undefined) {
    logger.info('No Authorization in header');
    next();
  }
  else {
    logger.info('Authorization header is ' + req.get('Authorization'));

    var authParam = req.get('Authorization').split('');

    if (authParam.length != 2) {
      next();
    }
    else {
      if (authParam[0] == 'Basic') {
        authenticateClient(authParam, res, req, next);
      }
      else if (authParam[1] == 'Bearer') {
        authenticateUser(authParam, res, req, next);
      }
      else {
        next();
      }
    }
  }
}

function authenticateClient(authParam, req, res, next) {

  logger.info('Authenticating client ...');

  clientModel.authenticateClientBySecret(authParam[1], function (err, client) {
    if (err) {
      logger.error('Unable to get client');
      next();
    }
    else if(client != undefined) {
      logger.info('Client is ' + client.applicationName);
      req.authClient = client;
      next();
    }
    else {
      logger.info('Invalid client');
      next();
    }
  });
}

function authenticateUser(authParam, req, res, next) {

  logger.info('Authenticating user ...');

  userModel.getToken(authParam[1], function (err, token) {
    if (err) {
      logger.error('Unable to get token');
      next();
    }
    else if (token != undefined && token.client.activated == true) {
      logger.info('User is ' + token.user._id);
      logger.info('Client is ' + token.client.applicationName);

      req.authClient = token.client;
      req.authUser = token.user;
      req.authToken = token;
      next();
    }
    else {
      logger.info('Invalid Bearer token');
      next();
    }
  });
}

module.exports = authenticateRequest;