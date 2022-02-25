const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action;
    const email = userRequest.params.email;
    const grade = userRequest.grade['origin'];
    const studentID = userRequest.studentID['origin']
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
                        text: "프로필 생성이 완료되었습니다. 이제 컴공봇을 자유롭게 이용하시기 바랍니다!"
                    }
                }
            ]
        }
    };
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;