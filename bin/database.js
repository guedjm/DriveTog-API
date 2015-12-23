var mongoose = require('mongoose');
var config = require(__base + 'config');
var logger = require(__base + 'bin/logger');

var initializeDatabaseConnection = function () {

  logger.info('Initializing database connection ...');

  mongoose.connection.on('open', function() {
    logger.info('Database connection initialized');
  });

  mongoose.connection.on('error', function () {
    logger.error('Cannot connect to database ...');
    process.exit(1);
  });

  mongoose.connect('mongodb://' + config.database.server + ':' + config.database.port + '/' + config.database.database);
};

module.exports.initializeDatabaseConnection = initializeDatabaseConnection;