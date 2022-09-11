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
const freeBoard = require('./crawling/free-board');
const education = require('./crawling/education');
const engineering = require('./crawling/engineering');
const curriculum = require('./crawling/curriculum');
const completionSystem = require('./crawling/completion-system');
const facultyIntroduction = require('./crawling/faculty-introduction');

const coldBreak = require('./cold-break');
const checkNumber = require('./check-number');
const checkStudentID = require('./check-sid');
const createTestDB = require('./create-testDB');

app.use(cors()); // cors 설정
app.use(express.json()); // 모든 입력&출력은 JSON 포맷으로
app.use('/public', publicHub); // 학과 공용 서비스 미들웨어
app.use('/public/service', publicService); // 학과 공용 서비스 컨트롤러
app.use('/private', privateHub); // 학과 전용 서비스 미들웨어
app.use('/private/service', privateService); // 학과 전용 서비스 컨트롤러
app.use('/personal', personalHub); // 학과 개인 서비스 미들웨어
app.use('/personal/service', personalService); // 학과 개인 서비스 컨트롤러
app.use('/setting', setting); // 설정 미들웨어
app.use('/setting/service', settingService); // 설정 컨트롤러
app.use('/input/profile', profile); // 프로필 입력처리
app.use('/input/credit', credit); // 학점 입력처리
app.use('/input/credit-modify', creditModify); // 학점 수정처리
app.use('/input/studentID-modify', studentIDModify); // 학번 수정처리
exports.middleWare = functions
    .region('asia-northeast1')
    .https
    .onRequest(app); // ComgongBOT 라우터 기본 주소

exports.notice = notice.notice; // 공지사항 크롤링 미들웨어
exports.newNews = newNews.newNews; // 새소식 크롤링 미들웨어
exports.freeBoard = freeBoard.freeBoard; // 자유게시판 크롤링 미들웨어
exports.education = education.education; // 외부 IT행사 및 교육 크롤링 미들웨어
exports.engineering = engineering.engineering; // 공학인증자료실 크롤링 미들웨어
exports.curriculum = curriculum.curriculum; // 교과과정 크롤링 미들웨어
exports.completionSystem = completionSystem.completionSystem; // 이수체계도 크롤링 미들웨어
exports.facultyIntroduction = facultyIntroduction.facultyIntroduction; // 교수진소개 크롤링 미들웨어

exports.coldBreak = coldBreak.coldBreak; // cold start 이슈 개선의 미들웨어
exports.checkNumber = checkNumber.checkNumber; // 숫자 값 입력 검증 API 미들웨어
exports.checkStudentID = checkStudentID.checkStudentID; // 학번 수정 검증 API 미들웨어
exports.createTestDB = createTestDB.createTestDB; // 테스트 학번-최저이수DB 작성 미들웨어