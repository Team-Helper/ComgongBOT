const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createTestDB = functions // 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
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
                res.sendStatus(200);
            })
            .catch(err => {
                console.error('Error... : ', err);
                res.sendStatus(400);
            });
    });