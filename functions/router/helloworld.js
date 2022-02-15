const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const responseReuslt = await admin
        .auth()
        .getUserByEmail('test@test.com')
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            // console.log('Sign in!');
            const responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "인증 성공!"
                            }
                        }
                    ]
                }
            };
            return responseBody;
        })
        .catch((error) => {
            // console.log('Error fetching user data:', error);
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
                                        "title": "이메일",
                                        "description": "O/X"
                                    }, {
                                        "title": "학년/학번",
                                        "description": "O/X"
                                    }, {
                                        "title": "학점",
                                        "description": "O/X"
                                    }
                                ],
                                "title": "컴공봇 이용을 위해 이메일 인증과 학년/학번 그리고 학점 입력은 필수 입니다."
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
                        }, {
                            "messageText": "나의 학점을 입력할게",
                            "action": "block",
                            "blockId": req.headers.key,
                            "label": "학점 입력"
                        }
                    ]
                }
            };
            return responseBody;
        });

    // console.log(responseReuslt);
    res
        .status(200)
        .send(responseReuslt);

});

module.exports = router;