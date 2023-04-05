const winston = require("winston");
const path = require("path");

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(__dirname, '../combined.log')})
    ]
});

module.exports = logger
