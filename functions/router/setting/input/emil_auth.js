const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    console.log(req.body);
    res
                .status(201)
                .send('Create user profile success');
    // const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    // const userRequest = req.body.Data; // 사용자 입력 데이터
    // const email = userRequest.email; // 입력한 이메일
    // const grade = userRequest.grade; // 입력한 학년
    // const studentID = userRequest.studentID; // 입력한 학번
    // console.log(email, grade, studentID);

    // const firestore = admin.firestore();
    // const docRef = firestore
    //     .collection('users')
    //     .doc(userAbout.plusfriendUserKey); // 사용자 카카오채널 id 값으로 프로필 DB 생성
    // await docRef
    //     .set(
    //         {email: email, grade: grade, studentID: studentID, status: true, engineeringStatus: true} // 프로필 DB에 기본 데이터 생성 (재학상태와 공학인증여부는 기본적으로 '재학')
    //     )
    //     .then(() => {
    //         res
    //             .status(201)
    //             .send('Create user profile success');
    //     })
    //     .catch(err => {
    //         console.error('Error from set profile DB:', err);
    //         res.sendStatus(err.response.status); // 에러 코드 전송
    //     });
});

module.exports = router;