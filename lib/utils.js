var winston = require('winston'),
    logger;

exports.logger = new winston.Logger({
  exitOnError: true
  // transports: transports
});