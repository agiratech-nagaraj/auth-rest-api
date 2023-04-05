const mongoose = require("mongoose");
const config = require("../config/index")
const winstonLogger = require('../services/logger.service');

module.exports = {
    connect: async ()=>{
        try {
            await mongoose.connect(config.db.url, {
                useNewUrlParser: true,
                // useUnifiedTopology: true,
            });
            winstonLogger.info('SUCCESS: DATABASE CONNECTED SUCCESSFULLY');
        }catch (e) {
            winstonLogger.error("ERROR: " + e);
        }
    }
}
