const AWS = require("aws-sdk");
const config = require("../config/index")
const multer = require('multer');
const multerS3 = require('multer-s3');
const shortId = require('shortid');

class S3BucketService {
    #config = {
        endpoint: config.s3.url,
        accessKeyId: config.s3.key,
        secretAccessKey: config.s3.secret,
    };
    #S3Ins = null;
    static #instance = null;

    constructor() {
        const spacesEndpoint = new AWS.Endpoint(config.s3.url);
        this.#S3Ins = new AWS.S3({...this.#config, endpoint: spacesEndpoint});
        this.upload = multer({
            storage: multerS3({
                s3: this.#S3Ins,
                acl: 'public-read',
                contentType: multerS3.AUTO_CONTENT_TYPE,
                bucket: config.s3.bucket,
                metadata: function (req, file, cb) {
                    cb(null, {fieldName: file.fieldname});
                },
                key: function (req, file, cb) {
                    const folder = req.path.split("/")?.[2] ?? '';
                    const fileExt = file.originalname.split(".");
                    cb(null, folder+"/"+shortId.generate() +"."+fileExt[fileExt.length-1]);
                }
            })
        });
    }

    static getInstance() {
        if (this.#instance) {
            return this.#instance;
        }
        return new S3BucketService();
    }
}

module.exports = S3BucketService.getInstance();
