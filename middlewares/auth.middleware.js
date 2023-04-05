const jwtService = require('../services/jwt.service');

module.exports = function authMiddleware(req, res, next) {
    const authToken = req.headers['authorization'];
    try {

        const decoded = jwtService.verifyToken(authToken);
        req.body.authData = decoded;
        if (decoded && decoded.exp > new Date().getTime() / 1000) {
            return next();
        } else {
            res.status(401).send({
                status: 'error',
                statusCode: 401,
                message: 'You must be logged in to view this page.'
            });
        }
    }catch (e) {
        res.status(401).send({
            status: 'error',
            statusCode: 401,
            message: 'You must be logged in to view this page.'
        });
    }
}
