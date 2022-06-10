const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createTestDB = functions // 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        // console.log(req.body.admin);
        if (req.body.admin === functions.config().service_key.admin) { // 모듈 실행에 앞서 특정 key 값이 있는 요청인 경우
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
            }; // 테스트 단위 공학 인증 DB 데이터 생성
            const firestore = admin.firestore();
            let docRef = firestore
                .collection('engineeringCredits')
                .doc(thisYear);
            await docRef
                .set(engineeringTestData) // DB set
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
            }; // 테스트 단위 일반 인증 DB 데이터 생성
            docRef = firestore
                .collection('credits')
                .doc(thisYear);
            await docRef
                .set(creditsTestData)
                .then((result) => { // DB set
                    console.log('succeess! : ', result);
                    res.sendStatus(201);
                })
                .catch(err => {
                    console.error('Error... : ', err);
                    res.sendStatus(400);
                });
        } else { // 특정 key 값이 없는 요청인 경우
            console.error('No have key');
            res.sendStatus(400);
        }
    });