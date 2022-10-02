const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const CryptoJS = require('crypto-js');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    // console.log(req.body);
    const userRequest = req.body.Data;
    const email = userRequest.email;
    const studentID = parseInt(userRequest.studentID);
    /* 쿼리스트링으로 넘어온 값 중에 암호화 되었던 사용자 카카오채널 id값을 복호화*/
    const bytes = CryptoJS
        .AES
        .decrypt(userRequest.userKey, functions.config().service_key.aes);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // console.log(email, studentID, decrypted);

    /* 사용자 카카오채널 id 값을 문서로 하여 프로필 DB 생성 */
    const firestore = admin.firestore();
    const docRef = firestore
        .collection('users')
        .doc(decrypted);
    await docRef
        .set(
            {email: email, studentID: studentID, engineeringStatus: true} // 프로필 DB에 공학인증 상태 값은 true로 기본 설정
        )
        .then(() => {
            res
                .status(201)
                .send('Create user profile success');
        })
        .catch(err => {
            console.error('Error from set profile DB:', err);
            res.sendStatus(err.response.status);
        });
});

module.exports = router;