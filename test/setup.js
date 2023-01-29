const winston = require("winston");
const logger = require("../logger");

logger.transports.find(t => t instanceof winston.transports.Console).silent = true;
logger.transports.find(t => t instanceof winston.transports.File).silent = false;