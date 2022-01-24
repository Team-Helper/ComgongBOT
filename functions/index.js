const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
admin.initializeApp();
const app = express();

const HelloWorld = require('./router/HelloWorld');
const publicHub = require('./router/public/publicHub');

app.use(cors());
app.use('/', HelloWorld);
app.use('/public',publicHub);


// exports.middleWare = functions
//     .region('asia-northeast1')
//     .https
//     .onRequest(app);


module.exports = app;