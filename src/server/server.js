const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const ipcmain = require(path.resolve(__dirname, 'ipcMians.js'));
// import toutiaoRouter from './routers/toutiao.js';
import toutiaoRouter from './routers/toutiao.js';
console.log(toutiaoRouter)
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/toutiao', toutiaoRouter);
// app.use('/toutiao', require('./routers/toutiao.js').default );


app.listen(3002, () => console.log('Example app listening on port 3002!'));