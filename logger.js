const winston = require('winston');
const {LoggingWinston} = require('@google-cloud/logging-winston');
const config = require('config');

const transports = [];

var settings = config.has('logging.file') ? config.get('logging.file') : { };
if (settings && (settings.enabled === undefined || settings.enabled)) {
    transports.push(new winston.transports.File({ 
        filename: settings.path || 'debug.log', 
        level: settings.level || 'verbose'
    }));
}

settings = config.has('logging.gcp') ? config.get('logging.gcp') : { };
if (settings && settings.enabled) {
    transports.push(new LoggingWinston({ level: settings.level || 'verbose' }));
}

settings = config.has('logging.console') ? config.get('logging.console') : { };
// Always add console logging, unless explicitly disabled.
if (!settings || settings.enabled !== false) {
    transports.push(new winston.transports.Console({
        format: winston.format.simple(),
        level: (settings && settings.level) ? settings.level : 'verbose'
    }));
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.simple(),
  transports: transports
});

module.exports = logger;