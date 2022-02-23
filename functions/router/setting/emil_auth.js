const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.params;
    const grade = JSON.parse(userRequest.grade);
    const studentID = JSON.parse(userRequest.studentID)
    // console.log(userRequest.email, grade.amount, studentID.amount);

    await admin
        .auth()
        .createUser({email: userRequest.email})
        .catch(e => {
            console.error('Error from auth to createUser:', e);
        });
    const firestore = admin.firestore();
    const docRef = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    await docRef
        .set(
            {email: userRequest.email, grade: grade.amount, studentID: studentID.amount}
        )
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