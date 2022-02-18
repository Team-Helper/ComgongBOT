const express = require('express');
const router = express.Router();
const startAuth = require('../helloworld');

router.post('/', async function (req, res) {
    // console.log(req.headers.key);
    const checkAuth = true;
    // console.log(check);
    let responseBody;

    if (checkAuth == true) {
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "💬 원하시는 키워드를 선택해주세요"
                        }
                    }
                ],
                quickReplies: [
                    {
                        "messageText": "해당 키워드를 조회해줘",
                        "action": "block",
                        "blockId": req.headers.key,
                        "label": "키워드"
                    }, {
                        "messageText": "해당 키워드를 조회해줘",
                        "action": "block",
                        "blockId": req.headers.key,
                        "label": "키워드2"
                    }, {
                        "messageText": "해당 키워드를 조회해줘",
                        "action": "block",
                        "blockId": req.headers.key,
                        "label": "키워드3"
                    }
                ]
            }
        };
    } else {
        responseBody = check
    }
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;