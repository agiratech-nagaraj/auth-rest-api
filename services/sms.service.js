const accountSid = process.env.TTWILLO_ACCOUNT_SID;
const authToken = process.env.TWILLO_AUTH_TOKEN;
console.log(accountSid);
const client = require('twilio')(accountSid, authToken);
const logger = require('./logger.service');

class SmsService {
    static sendOTP(mobileNo, code) {
        client.messages
            .create({
                body: `Your verification code is ${code}`,
                to: mobileNo
            })
            .then(message => logger.info('SMS sent to: ' + mobileNo))
            .done();
    }
}
module.exports = SmsService;
