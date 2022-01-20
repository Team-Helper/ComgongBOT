const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
admin.initializeApp();
const app = express();

const HelloWorld = require('./router/HelloWorld');

app.use(cors());
app.use('/', HelloWorld);

// exports.middleWare = functions
//     .region('asia-northeast1')
//     .https
//     .onRequest(app);

module.exports = app;