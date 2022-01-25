const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
admin.initializeApp();
const app = express();

const helloWorld = require('./router/helloworld');
const publicHub = require('./router/public/public_hub');
const privateHub = require('./router/private/private_hub');
const personalHub = require('./router/personal/personal_hub');
const setting = require('./router/setting/setting_hub');

const publicService = require('./router/public/public_service');

app.use(cors());
app.use('/', helloWorld);
app.use('/public', publicHub);
app.use('/private', privateHub);
app.use('/personal', personalHub);
app.use('/setting', setting);

exports.middleWare = functions
    .region('asia-northeast1')
    .https
    .onRequest(app);

exports.public_service = publicService.public_service;

//module.exports = app;