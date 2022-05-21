const express = require('express');
const router = express.Router();

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    console.log(userAbout);
    const userRequest = req.body.action.detailParams; // 사용자 입력 데이터
    console.log(userRequest);

    const test = userRequest.test.value; // 입력한 전공필수
    console.log(typeof test);
    if (typeof test === 'string') {
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;