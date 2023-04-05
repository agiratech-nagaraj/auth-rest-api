const nodemailer = require('nodemailer');
const config = require("../config/index");
const logger = require('./logger.service');

class EmailService {
    #transporter;
    #mailOptions = {
        from: config.email.id,
    };
    #transporterOptions = {
        service: config.email.service,
        host: 'smtp.gmail.com',
        port: 465,
        secure: false,
        debug: true,
        logger: false,
        secureConnection: false,
        tls:{
            rejectUnAuthorized:true
        },
        auth: {
            user: config.email.id,
            pass: config.email.password
        }
    }
    static instance = null;

    constructor() {
        this.#transporter = nodemailer.createTransport(this.#transporterOptions);
    }

    send({to, subject, text, html}) {
        this.#transporter.sendMail({
            ...this.#mailOptions,
            to,
            subject,
            text,
            html
        }, function (error, info) {
            if (error) {
                logger.error('Email service error:', error);
            } else {
                logger.info('Email sent: ' + info.response);
            }
        });
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        return new EmailService();
    }
}

module.exports = EmailService.getInstance();
