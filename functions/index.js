const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
admin.initializeApp();
const app = express();

const publicHub = require('./router/public/hub');
const publicService = require('./router/public/service');
const personalHub = require('./router/personal/hub');
const personalService = require('./router/personal/service');
const setting = require('./router/setting/hub');
const settingService = require('./router/setting/service');
const profile = require('./router/setting/input/profile');
const credit = require('./router/setting/input/credit');
const creditModify = require('./router/setting/input/credit-modify');
const studentIDModify = require('./router/setting/input/studentID-modify');
const serviceOfficeInfo = require('./router/service-officeInfo');

const notice = require('./crawling/notice');
const newNews = require('./crawling/new-news');
const freeBoard = require('./crawling/free-board');
const education = require('./crawling/education');
const engineering = require('./crawling/engineering');
const curriculum = require('./crawling/curriculum');
const completionSystem = require('./crawling/completion-system');
const facultyIntroduction = require('./crawling/faculty-introduction');
const officeInfo = require('./crawling/office-info');

const coldBreak = require('./cold-break');
const createTestDB = require('./create-testDB');

app.use(cors()); // cors 설정
app.use(express.json()); // 모든 입력&출력은 JSON 포맷으로

/* 서비스 선택 관련 미들웨어/컨트롤러 */
app.use('/public', publicHub);
app.use('/public/service', publicService);
app.use('/personal', personalHub);
app.use('/personal/service', personalService);
app.use('/setting', setting);
app.use('/setting/service', settingService);
app.use('/input/profile', profile);
app.use('/input/credit', credit);
app.use('/input/credit-modify', creditModify);
app.use('/input/studentID-modify', studentIDModify);
app.use('/officeInfo', serviceOfficeInfo);
exports.middleWare = functions
    .region('asia-northeast1')
    .https
    .onRequest(app);

/* 크롤링 미들웨어 */
exports.notice = notice.notice;
exports.newNews = newNews.newNews;
exports.freeBoard = freeBoard.freeBoard;
exports.education = education.education;
exports.engineering = engineering.engineering;
exports.curriculum = curriculum.curriculum;
exports.completionSystem = completionSystem.completionSystem;
exports.facultyIntroduction = facultyIntroduction.facultyIntroduction;
exports.officeInfo = officeInfo.officeInfo;

/* cold start 이슈 개선, 테스트 단위 사용자 작성 미들웨어 */
exports.coldBreak = coldBreak.coldBreak;
exports.createTestDB = createTestDB.createTestDB;

process.env.NODE_ENV = (
    process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() == 'production'
)
    ? 'production'
    : 'development'; // 개발/배포 모드 구분을 위한 환경변수 지정