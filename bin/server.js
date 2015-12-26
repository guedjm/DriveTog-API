var vhost = require('vhost');
var express = require('express');
var http = require('http');

//Defining root dir for project
global.__base = __dirname + '/../';

var config = require(__base + 'config');
var logger = require(__base + 'bin/logger');
var database = require(__base + 'bin/database');

function start() {

  logger.info('Logger started');
  database.initializeDatabaseConnection();

  var app = require(__dirname + '/../app/app');

  if (config.server.vhost) {
    logger.info('Initializing vhost ...');

    var exp = express();
    exp.use(vhost(config.server.url, app));
    logger.info('Done');
  }

  logger.info('Initializing http server ...');

  var httpServer;
  if (config.server.vhost) {
    httpServer = http.createServer(exp);
  }
  else {
    httpServer = http.createServer(app);
  }

  httpServer.on('error', onError);
  httpServer.on('listening', onListening);
  httpServer.listen(config.server.port);
}

function disableLog() {
  logger.level = 'error';
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = 'Port ' + config.server.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  logger.info('Http server started');
}

module.exports.start = start;
module.exports.disableLog = disableLog;