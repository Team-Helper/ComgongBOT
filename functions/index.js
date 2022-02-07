const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
admin.initializeApp();
const app = express();

const helloWorld = require('./router/helloworld');
const publicHub = require('./router/public/public_hub');
const publicService = require('./router/public/public_service');
const privateHub = require('./router/private/private_hub');
const personalHub = require('./router/personal/personal_hub');
const setting = require('./router/setting/setting_hub');

const notice = require('./crawling/notice');
const new_news = require('./crawling/new_news');

app.use(cors());
app.use('/', helloWorld);
app.use('/public', publicHub);
app.use('/public/public_service', publicService);
app.use('/private', privateHub);
app.use('/personal', personalHub);
app.use('/setting', setting);

exports.middleWare = functions
    .region('asia-northeast1')
    .https
    .onRequest(app); // comgongbot 기본 루트 미들웨어

exports.notice = notice.notice; // 공지사항 크롤링 함수 미들웨어
exports.new_news = new_news.new_news;