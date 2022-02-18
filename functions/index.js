const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
admin.initializeApp();
const app = express();

const publicHub = require('./router/public/public_hub');
const publicService = require('./router/public/public_service');
const privateHub = require('./router/private/private_hub');
const personalHub = require('./router/personal/personal_hub');
const setting = require('./router/setting/setting_hub');
// const emailSet = require('./router/setting/emil_auth');

const notice = require('./crawling/notice');
const newNews = require('./crawling/new_news');
const facultyIntroduction = require('./crawling/faculty_introduction');
const freeBoard = require('./crawling/free_board');
const education = require('./crawling/education');
const curriculum = require('./crawling/curriculum');
const engineering = require('./crawling/engineering');
const completionSystem = require('./crawling/completion_system');

app.use(cors());
app.use('/public', publicHub);
app.use('/public/public_service', publicService);
app.use('/private', privateHub);
app.use('/personal', personalHub);
app.use('/setting', setting);
// app.use('/setting/email', emailSet);

exports.middleWare = functions
    .region('asia-northeast1')
    .https
    .onRequest(app); // comgongbot 기본 주소 미들웨어

exports.notice = notice.notice; // 공지사항 크롤링 미들웨어
exports.newNews = newNews.newNews; // 새소식 크롤링 미들웨어
exports.facultyIntroduction = facultyIntroduction.facultyIntroduction; // 교수진소개 크롤링 미들웨어
exports.freeBoard = freeBoard.freeBoard; // 자유게시판 크롤링 미들웨어
exports.education = education.education; // 외부 IT행사 및 교육 크롤링 미들웨어
exports.curriculum = curriculum.curriculum; // 교과과정 크롤링 미들웨어
exports.engineering = engineering.engineering; // 공학인증자료실 크롤링 미들웨어
exports.completionSystem = completionSystem.completionSystem; // 이수체계도 크롤링 미들웨어