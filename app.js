var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require("fs");
const cors = require('cors');
var engines = require('consolidate');

if (process.env.NODE_ENV != "production") {
    const dotenv = require("dotenv");
    dotenv.config();
}

var winstonLogger = require('./services/logger.service');
var mongoDB = require('./db/mongoose');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth.router');

mongoDB.connect();

var app = express();

app.set('views', __dirname + '/views');
app.engine('html', engines.ejs);
app.set('view engine', 'html');

app.use(logger('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
}));
let originsWhitelist = [
    'http://localhost:4200',      //this is my front-end url for development
];
let corsOptions = {
    origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials:true
}
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);

module.exports = app;
winstonLogger.info('APPLICATION STARTED');
