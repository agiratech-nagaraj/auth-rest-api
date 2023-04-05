let EventEmitter = require('events');
const randToken = require('rand-token');

const emailService = require('../services/email.service');
const TokenModel = require('../models/tokens.model');
const SmsService = require("../services/sms.service");
const SecurityService = require("../services/security.service");

const eventEmitter = new EventEmitter();

eventEmitter.on('email-verification', async (data) => {
    const token = SecurityService.generateOTP();
    await TokenModel.add({userId: data.email, token, type: 'email-verification'});
    emailService.send({
        to: data.email,
        subject: 'SHADOW:: VERIFY EMAIL',
        text: 'Please enter this code : ' + token
    });
});

eventEmitter.on('password-reset', async (user) => {
    const token = SecurityService.generateOTP();
    await TokenModel.add({userId: user.email, token, type: 'password-reset'});
    emailService.send({
        to: user.email,
        subject: 'ARAN:: RESET PASSWORD TOKEN',
        text: 'Please enter this code : ' + token
    });
});

eventEmitter.on('phone-verification', async (data) => {
    const token = SecurityService.generateOTP();
    await TokenModel.add({userId: data.phonenumber, token, type: 'email-verification'});
    SmsService.sendOTP(data.phonenumber, token)
});

eventEmitter.on('phone-password-reset', async (user) => {
    const token = SecurityService.generateOTP();
    await TokenModel.add({userId: user.phonenumber, token, type: 'password-reset'});
    SmsService.sendOTP(data.phonenumber, token)
});

module.exports = eventEmitter;
