var express = require('express');
var router = express.Router();
const uploadService = require("../services/s3-bucket.service");
const multer = require('multer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//use by upload form
router.post('/upload',(req, res, next)=>{
  const upload = uploadService.upload.single('image');
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError)
      return res.status(400).json({
        message: 'Upload unsuccessful',
        errorMessage: error.message,
        errorCode: error.code
      })

    if (error) {
      console.log(error)
      return res.status(500).json({
        message: 'Error occured',
        errorMessage: error.message
      })

    }
    next()
  })
}, function (req, res, next) {

  res.status(!req.file?400:200).send({
    message: !req.file ? 'Error occured': "Uploaded!",
    location: req?.file?.location
  });
});

module.exports = router;
