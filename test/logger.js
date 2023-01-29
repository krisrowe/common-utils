const assert = require('assert');
const config = require('config');
const logger = require('../logger.js');
const setup = require('./setup.js'); // ensure global test setup is run

describe ('logger', function() {
    it('should log stuff', function() {
        logger.log('info', 'Test log entry!');
    });
});