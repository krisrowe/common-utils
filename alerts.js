const path = require('path');
const process = require('process');
const logger = require('./logger.js');

const SECRETS_PATH = process.env.TWILIO_CREDS_PATH || path.join(process.cwd(), 'secrets/twilio.json');

var _twilio;

function getTwilio() {
    if (!_twilio) {
        var secrets;
        try {
           secrets = require(SECRETS_PATH); 
        } catch (ex) {
            throw new Error(`Failed to read secrets for Twilio from path "${SECRETS_PATH}": ${ex}`);
        }
        var client;
        try {
            client = require('twilio')(secrets.accountSid, secrets.token); 
        } catch (ex) {
            throw new Error(`Failed to initialize client Twilio: ${ex}`);
        }
        _twilio = { secrets: secrets, client: client };
    }
    return _twilio;
}

function sendSms(body, to = null) {
    return new Promise((resolve, reject) => {
        var twilio;
        try {
            twilio = getTwilio();
        } catch (ex) {
            logger.log('error', 'Failed to initialize Twilio: ' + ex);
            reject(ex);
        }
        to = to || twilio.secrets.defaultSendTo;
        try {
            twilio.client.messages.create({ 
            body: body,  
            messagingServiceSid: twilio.secrets.messagingServiceSid,      
            to: to
            }).then(message => {
                resolve(message);
            }).catch(reason  => {
                logger.log('error', 'Failed to send SMS: ' + reason);
                reject(reason);  
            }); 
        } catch (ex) {
            logger.log('error', 'Failed to send SMS: ' + ex);
            reject(ex);  
        }   
    });    
}

function standardizePhoneNumber(phoneNumber) {
    if (!phoneNumber) {
        return phoneNumber;
    }
    // remove any of the following 
    // - open parenthesis
    // - close parenthesis
    // - dash
    // - space
    var raw = phoneNumber.replace(/[\(\)\-\s]/g, '');
    if (/^\+?\d+$/.test(raw) == false) {
        throw new Error('Invalid phone number format.');
    }
    if (!raw.startsWith('+')) {
        raw = "+1" + raw;
    }
    return raw;
}

module.exports = { sendSms, standardizePhoneNumber };
