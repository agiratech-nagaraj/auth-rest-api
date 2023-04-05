const express = require("express");
const AuthController = require("../controllers/auth.controller");
const router = express.Router();

router.post('/register', AuthController.register);
router.post('/reset-otp', AuthController.resendOTP);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-forgot-password-token', AuthController.verifyForgotPasswordToken);
router.post('/change-password', AuthController.changePassword);

module.exports = router;
