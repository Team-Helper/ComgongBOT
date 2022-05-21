const express = require('express');
const router = express.Router();

router.post('/', async function (req, res) {
    // const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout);
    // console.log(req.body);
    const userRequest = req.body.utterance; // 사용자 입력 데이터
    console.log(userRequest, typeof userRequest);
    if (typeof userRequest === 'string') {
        res.status(200).send(userRequest);
    } else {
        res.status(400).send('fail');
    }
});

module.exports = router;