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
const newNews = require('./crawling/new_news');
const facultyIntroduction = require('./crawling/faculty_introduction');
const freeBoard = require('./crawling/free_board');
const education = require('./crawling/education');

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
exports.newNews = newNews.newNews;
exports.facultyIntroduction = facultyIntroduction.facultyIntroduction;
exports.freeBoard = freeBoard.freeBoard;
exports.education = education.education;