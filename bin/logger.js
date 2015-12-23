var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)()
  ]
});

logger.info('Logger started');

module.exports = logger;