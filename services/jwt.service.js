const jwt = require('jsonwebtoken')
const config = require('../config/index');

module.exports = class JwtService {
    static generateToken(userId, role) {
        return jwt.sign({userId: userId, userType: role}, config.jwtSecret, {
            expiresIn: 86400
        });
    }

    static verifyToken(token) {
        if(!token) return;
        return  jwt.verify(token, config.jwtSecret)
    }
}
