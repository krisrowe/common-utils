const winston = require('winston');
const {LoggingWinston} = require('@google-cloud/logging-winston');
const config = require('config');

const transports = [];

var settings = config.has('logging.file') ? config.get('logging.file') : { };
transports.push(new winston.transports.File({ 
  filename: settings.path || 'debug.log', 
  level: settings.level || 'verbose',
  silent: !config.has('logging.file') || settings.enabled === false
}));

if (config.has('logging.gcp')) {
  settings = config.get('logging.gcp');
  transports.push(new LoggingWinston({ 
    level: settings.level || 'verbose',
    silent: settings.enabled === false
  }));
}

settings = config.has('logging.console') ? config.get('logging.console') : { };
transports.push(new winston.transports.Console({
  format: winston.format.simple(),
  level: (settings && settings.level) ? settings.level : 'verbose',
  silent: config.has('logging.console') && settings.enabled === false
}));

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.simple(),
  transports: transports
});

module.exports = logger;