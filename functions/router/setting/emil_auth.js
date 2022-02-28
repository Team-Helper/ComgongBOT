const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams;
    const email = userRequest.email['origin'];
    const grade = userRequest.grade['origin'];
    const studentID = userRequest.studentID['origin'];
    // console.log(email, grade, studentID);

    await admin
        .auth()
        .createUser({email: email})
        .catch(e => {
            console.error('Error from auth to createUser:', e);
        });

    // await admin
    //     .auth()
    //     .generateEmailVerificationLink(userRequest.email)
    //     .then(async (result) => {
    //         console.log(result);
    //     })
    //     .catch(e => {
    //         console.error('Error from auth to generateEmailVerificationLink:', e);
    //     });

    const firestore = admin.firestore();
    const docRef = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    await docRef
        .set({email: email, grade: grade, studentID: studentID})
        .catch(e => {
            console.error('Error from set DB:', e);
        });

    const responseBody = {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: "프로필 생성이 완료되었습니다. 하단의 버튼을 통해 본인의 학점도 바로 입력해주세요!"
                    }
                }
            ],
            quickReplies: [
                {
                    "messageText": "학점 입력할게",
                    "action": "block",
                    "blockId": functions
                        .config()
                        .service_url
                        .credit_key,
                    "label": "학점 입력"
                }
            ]
        }
    };
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;