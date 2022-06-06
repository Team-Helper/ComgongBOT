const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createTestDB = functions // 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        // console.log(req.body.admin);
        if (req.body.admin === functions.config().service_key.admin) {
            const thisYear = new Date()
                .getFullYear()
                .toString();
            // console.log(thisYear);
            const engineeringTestData = {
                'majorA': 39,
                'majorB': 24,
                'geA': 14,
                'geB': 20,
                'total': 123,
                'chapel': 6,
                'completionSystem': {
                    0: {
                        'imgAlt': "2021학년도 신입생 교과과정",
                        'imgURL': "https://www.sungkyul.ac.kr/sites/computer/images/2022_2.jpg"
                    },
                    1: {
                        'imgAlt': "2021학년도 신입생 교과과정",
                        'imgURL': "https://www.sungkyul.ac.kr/sites/computer/images/2022_1.jpg"
                    }
                }
            };  // 공학 인증 DB Set
            const firestore = admin.firestore();
            const docRef = firestore            // 공학 인증 DB 생성
                .collection('engineeringCredits')
                .doc(thisYear);
            await docRef
                .set(engineeringTestData)
                .then((result) => {
                    console.log('succeess! : ', result);
                    res.sendStatus(201);
                })
                .catch(err => {
                    console.error('Error... : ', err);
                    res.sendStatus(400);
                });

            const creditsTestData = {
                'majorA': 39,
                'majorB': 3,
                'geA': 14,
                'geB': 20,
                'total': 123,
                'chapel': 6
            };  // 일반 인증 DB Set
            const docRefCredits = firestore     // 일반 인증 DB 생성
                .collection('credits')
                .doc(thisYear);
            await docRefCredits
                .set(creditsTestData)
                .then((result) => {
                    console.log('succeess! : ', result);
                    res.sendStatus(201);
                })
                .catch(err => {
                    console.error('Error... : ', err);
                    res.sendStatus(400);
                });
        } else {
            console.error('No have key');
            res.sendStatus(400);
        }
    });