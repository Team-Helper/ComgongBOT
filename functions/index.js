const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
admin.initializeApp();
const app = express();

const publicHub = require('./router/public/hub');
const publicService = require('./router/public/service');
const privateHub = require('./router/private/hub');
const privateService = require('./router/private/service');
const personalHub = require('./router/personal/hub');
const personalService = require('./router/personal/service');
const setting = require('./router/setting/hub');
const settingService = require('./router/setting/service');
const profile = require('./router/setting/input/profile');
const credit = require('./router/setting/input/credit');
const creditModify = require('./router/setting/input/credit-modify');
const studentIDModify = require('./router/setting/input/studentID-modify');

const notice = require('./crawling/notice');
const newNews = require('./crawling/new-news');
const facultyIntroduction = require('./crawling/faculty-introduction');
const freeBoard = require('./crawling/free-board');
const education = require('./crawling/education');
const curriculum = require('./crawling/curriculum');
const engineering = require('./crawling/engineering');
const completionSystem = require('./crawling/completion-system');

const coldBreak = require('./cold-break');
const countGrade = require('./count-grade');
const checkNumber = require('./check-number');
const checkStudentID = require('./check-sid');

app.use(cors());
app.use(express.json());
app.use('/public', publicHub);
app.use('/public/service', publicService);
app.use('/private', privateHub);
app.use('/private/service', privateService);
app.use('/personal', personalHub);
app.use('/personal/service', personalService);
app.use('/setting', setting);
app.use('/setting/service', settingService);
app.use('/input/profile', profile);
app.use('/input/credit', credit);
app.use('/input/credit-modify', creditModify);
app.use('/input/studentID-modify', studentIDModify);

exports.middleWare = functions
    .region('asia-northeast1')
    .https
    .onRequest(app); // ComgongBOT 기본 주소 미들웨어

exports.notice = notice.notice; // 공지사항 크롤링 미들웨어
exports.newNews = newNews.newNews; // 새소식 크롤링 미들웨어
exports.facultyIntroduction = facultyIntroduction.facultyIntroduction; // 교수진소개 크롤링 미들웨어
exports.freeBoard = freeBoard.freeBoard; // 자유게시판 크롤링 미들웨어
exports.education = education.education; // 외부 IT행사 및 교육 크롤링 미들웨어
exports.curriculum = curriculum.curriculum; // 교과과정 크롤링 미들웨어
exports.engineering = engineering.engineering; // 공학인증자료실 크롤링 미들웨어
exports.completionSystem = completionSystem.completionSystem; // 이수체계도 크롤링 미들웨어

exports.coldBreak = coldBreak.coldBreak; // cold start 이슈 개선의 미들웨어
exports.countGrade = countGrade.countGrade; // 학년 값 자동증가의 미들웨어
exports.checkNumber = checkNumber.checkNumber; // 숫자 값 입력 검증 API 미들웨어
exports.checkStudentID = checkStudentID.checkStudentID; // 학번 수정 검증 API 미들웨어