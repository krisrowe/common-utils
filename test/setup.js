const winston = require("winston");
const logger = require("../logger");

console.log('transport coutn: ' + logger.transports.length);
logger.transports.find(t => t instanceof winston.transports.Console).silent = true;
logger.transports.find(t => t instanceof winston.transports.File).silent = false;