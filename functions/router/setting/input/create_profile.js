const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const CryptoJS = require('crypto-js');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    console.log(req.body);
    const userRequest = req.body.Data; // 입력한 사용자의 데이터 조회
    const email = userRequest.email; // 입력한 이메일
    const grade = parseInt(userRequest.grade); // 입력한 학년
    const studentID = parseInt(userRequest.studentID); // 입력한 학번
    /* 사용자 카카오채널 id값 복호화*/
    const bytes = CryptoJS
        .AES
        .decrypt(userRequest.userKey, functions.config().service_key.aes_key);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // console.log(email, grade, studentID, decrypted);

    /* 사용자 카카오채널 id 값으로 프로필 DB 생성 */
    const firestore = admin.firestore();
    const docRef = firestore
        .collection('users')
        .doc(decrypted);
    await docRef
        .set(
            {email: email, grade: grade, studentID: studentID, status: true, engineeringStatus: true} // 프로필 DB에 기본 데이터 생성 (재학상태와 공학인증여부는 기본적으로 '재학')
        )
        .then(() => {
            res
                .status(201)
                .send('Create user profile success'); // 응답 상태 코드와 내용 전송
        })
        .catch(err => {
            console.error('Error from set profile DB:', err);
            res.sendStatus(err.response.status); // 에러 코드 전송
        });
});

module.exports = router;