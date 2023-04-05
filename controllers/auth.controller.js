const TokenModel = require("../models/tokens.model");
const UsersModel = require("../models/users.model");
const eventEmitter = require("../subscribers/event-subscribers");
const JwtService = require("../services/jwt.service");
const Helper = require("../common/helper");

class AuthController {
    static #instance = null;

    async register(req, res) {
        const user = req.body;
        try {
            const result = await UsersModel.register(user);
            if (result) {
                eventEmitter.emit('email-verification', user)
                res.status(202).send({
                    status: 'success',
                    data: {
                        id: result._id
                    }
                });
            }
        } catch (e) {
            res.status(400).send({
                statusCode: 400,
                status: 'error',
                message: e.error
            });
        }
    }

    async login(req, res) {
        const userData = req.body;
        try {
            const result = await UsersModel.authenticate({
                email: userData.email,
                password: userData.password
            });
            if (result.isEmailVerified) {
                const token = JwtService.generateToken(result._id, result.userType);
                res.status(200).send({
                    status: 'success',
                    data: result,
                    token: token
                });
            } else {
                eventEmitter.emit('email-verification', result)
                res.status(402).send({
                    statusCode: 402,
                    status: 'error',
                    message: 'Pls verify your email'
                });
            }
        } catch (e) {
            res.status(403).send({
                statusCode: 403,
                status: 'error',
                message: e.error
            });
        }
    }

    async verifyEmail(req, res) {
        const email = req.body?.email;
        const token = req.body?.token;
        const isTokenVerified = await TokenModel.verify({userId: email, token, type: 'email-verification'})
        if (isTokenVerified) {
            const doc = await UsersModel.updateEmailVerified({email: email});
            if (doc) {
                res.status(200).send({
                    status: 'success',
                    data: 'Token validated successfully',
                });
            }
            return
        }

        res.status(403).send({
            status: 'error',
            data: 'Invalid token',
            statusCode: 403
        });
    }

    async forgotPassword(req, res) {
        const userData = req.body;
        const user = UsersModel.findOne().byEmail({email: userData.email});
        if (user) {
            eventEmitter.emit('password-reset', {email: userData.email});
            res.status(200).send({
                status: 'success',
                data: 'Please check your email and verify token',
            });
            return
        }
        res.status(403).send({
            status: 'error',
            data: 'User not exist',
            statusCode: 403
        });
    }

    async resetPassword(req, res) {
        const userData = req.body;
        const user = UsersModel.resetPassword({email: userData.email, password: userData.password});
        if (user) {
            res.status(200).send({
                status: 'success',
                data: user,
            });
            return
        }
        res.status(403).send({
            status: 'error',
            data: 'Please try again',
            statusCode: 403
        });
    }

    async verifyForgotPasswordToken(req, res) {
        const email = req.body?.email;
        const token = req.body?.token;
        const doc = await TokenModel.findOne({userId: email, token, type: 'password-reset'})
        await UsersModel.updateEmailVerified({email: email});
        Helper.handleBinaryResponse(res, !!doc, 'Please try again');
    }

    async changePassword(req, res) {
        const email = req.body?.email;
        const token = req.body?.token;
        const doc = await TokenModel.findOne().byUserIdAndType({userId: email, token, type: 'password-reset'})
        if (doc){
            await TokenModel.findOneAndDelete({userId: email,type: 'password-reset'});
            const userData = req.body;
            const user = UsersModel.resetPassword({email: userData.email, password: userData.password});
            if (user) {
                res.status(200).send({
                    status: 'success',
                    data: user,
                });
                return
            }
            res.status(403).send({
                status: 'error',
                data: 'Please try again',
                statusCode: 403
            });
           return;
        }
        Helper.handleBinaryResponse(res, false, 'Unable to create child')
    }

    async resendOTP(req, res){
        const user = await UsersModel.findOne({email: req.email});
        if (user) eventEmitter.emit('email-verification', user);
        Helper.handleBinaryResponse(res, !!user, 'User not found');
    }

    static getInstance() {
        if (this.#instance) {
            return this.#instance;
        }
        return new AuthController();
    }
}

module.exports = AuthController.getInstance();
