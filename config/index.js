module.exports = {
    db: {
        url: process.env.NODE_ENV !=='production' ? process.env.DB_URL: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_DOMAIN}/${process.env.DB_NAME}?authSource=admin`,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT,
    api: {
        prefix: '/api/v1',
    },
    email:{
        service: process.env.EMAIL_SERVICE,
        id: process.env.EMAIL_ID,
        password: process.env.EMAIL_PASSWORD
    },
    s3:{
        key: process.env.S3_KEY,
        secret: process.env.S3_SECRET,
        url: process.env.S3_URL,
        bucket: process.env.S3_BUCKET,
    }
}
