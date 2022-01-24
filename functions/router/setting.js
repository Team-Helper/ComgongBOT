const express = require('express');
const router = express.Router();

router.post('/', async function (req, res) {
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
                    "messageText": "나의 학점을 수정할게",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "학점 수정"
                }, {
                    "messageText": "나의 학번을 변경할게",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "학번 변경"
                }, {
                    "messageText": "나의 학적상태를 변경할게",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "학적상태 변경"
                }
            ]
        }
    };
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;