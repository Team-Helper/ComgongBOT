const express = require('express');
const router = express.Router();

router.post('/', function (req, res) {
    console.log(req.headers.key);
    const responseBody = {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: "💬 원하시는 메뉴를 선택해주세요"
                    }
                }
            ],
            quickReplies: [
                {
                    "messageText": "나의 누적 학점을 알려줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "학점 조회"
                }, {
                    "messageText": "졸업까지 남은 학점을 계산해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "졸업까지의 학점계산"
                }, {
                    "messageText": "교과목별 최저이수 요구학점을 알려줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "졸업이수 조건 확인"
                }
            ]
        }
    };
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;