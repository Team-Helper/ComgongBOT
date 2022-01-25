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
                        text: "💬 원하시는 학과 메뉴를 선택해주세요"
                    }
                }
            ],
            quickReplies: [
                {
                    "messageText": "학과광장 게시판을 조회해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "학과광장"
                }, {
                    "messageText": "공학인증 게시판을 조회해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "공학인증"
                }, {
                    "messageText": "전공안내 게시판을 조회해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "전공안내"
                }, {
                    "messageText": "교수진소개 게시판을 조회해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "교수진소개"
                }
            ]
        }
    };
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;