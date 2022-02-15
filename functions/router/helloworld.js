const functions = require('firebase-functions');
const express = require('express');
const router = express.Router();

router.post('/', function (req, res) {
    const responseBody = {
        version: "2.0",
        template: {
            outputs: [
                {
                    itemCard: {
                        "head": {
                            "title": "누락된 설정이 있습니다."
                        },
                        "itemList": [
                            {
                                "title": "Flight",
                                "description": "KE0605"
                            }, {
                                "title": "Boards",
                                "description": "8:50 AM"
                            }, {
                                "title": "Departs",
                                "description": "9:50 AM"
                            }, {
                                "title": "Terminal",
                                "description": "1"
                            }, {
                                "title": "Gate",
                                "description": "C24"
                            }
                        ],
                        "itemListAlignment": "left"
                    }
                }
            ],
            quickReplies: [
                {
                    "messageText": "이메일 인증할게",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "이메일 인증"
                }, {
                    "messageText": "나의 학년/학번을 입력할게",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "학년/학번 입력"
                }
            ]
        }
    };
    res
        .status(200)
        .send(responseBody);
});

module.exports = router;