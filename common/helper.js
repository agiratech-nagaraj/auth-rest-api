const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

class Helper {
    static #instance = null;

    constructor() {
    }

    handleBinaryResponse(res, result, errMsg, successMsg = "Success"){
        if (result){
            res.status(200).send({
                status: 'success',
                data: result,
                message: successMsg
            });
            return;
        }
        res.status(400).send({
            statusCode: 400,
            status: 'error',
            message: errMsg
        });
    }

    convertToObjectId(id){
        return new ObjectId(id)
    }


    static getInstance() {
        if (this.#instance) {
            return this.#instance;
        }
        return new Helper();
    }
}

module.exports = Helper.getInstance();
