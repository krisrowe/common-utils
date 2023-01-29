const assert = require('assert');
const config = require('config');
const logger = require('../logger.js');
const setup = require('./setup.js'); // ensure global test setup is run
const alerts = require('../alerts.js');

describe ('alerts', function() {
    it('should standardize phone number', function() {
        const result = alerts.standardizePhoneNumber('(972) 555-1212');
        assert.equal(result, '+19725551212');
    });
});