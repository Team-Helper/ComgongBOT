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
            const testData = {
                'majorA': 39,
                'majorB': 24,
                'geA': 14,
                'geB': 20,
                'total': 123,
                'chapel': 6
            };
            const firestore = admin.firestore();
            const docRef = firestore
                .collection('engineeringCredits')
                .doc(thisYear);
            await docRef
                .set(testData)
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