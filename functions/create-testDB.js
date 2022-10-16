const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createTestDB = functions
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        // console.log(req.body.admin);
        /* 어드민 인증 key 값이 있는지 요청 상태 인지를 확인해 테스트 단위 DB 생성 실행 혹은 미실행 */
        if (req.body.admin === functions.config().service_key.admin) {
            const thisYear = new Date()
                .getFullYear()
                .toString();
            // console.log(thisYear);
            /* 공학 인증 DB 데이터 생성 */
            const engineeringTestData = {
                'majorMust': 39,
                'majorChoice': 24,
                'electiveMust': 14,
                'electiveChoice': 20,
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
            };
            const firestore = admin.firestore();
            let docRef = firestore
                .collection('engineeringCredits')
                .doc(thisYear);
            await docRef
                .set(engineeringTestData)
                .catch(err => {
                    console.error('Error... : ', err);
                    res.sendStatus(400);
                });

            /* 일반 인증 DB 데이터 생성 */
            const creditsTestData = {
                'majorMust': 39,
                'majorChoice': 3,
                'electiveMust': 14,
                'electiveChoice': 20,
                'total': 123,
                'chapel': 6
            };
            docRef = firestore
                .collection('credits')
                .doc(thisYear);
            await docRef
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