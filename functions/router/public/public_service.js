const express = require('express');
const router = express.Router();

router.post('/', function (req, res) {
    const userRequest = req.body.userRequest;
    const check = userRequest.utterance; // 사용자 요청문 인식
    let responseBody; // 응답 구조

    switch (check) {
        case "공지사항 게시판을 조회해줘":
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "공지사항을 조회했어요!"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "새소식 게시판을 조회해줘":
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "새소식을 조회했어요!"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "자유게시판을 조회해줘":
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "자유게시판을 조회했어요!"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "외부IT행사 및 교육 게시판을 조회해줘":
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "외부IT행사 및 교육을 조회했어요!"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "공학인증자료실 게시판을 조회해줘":
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "공학인증자료실을 조회했어요!"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "교과과정 게시판을 조회해줘":
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "교과과정을 조회했어요!"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "이수체계도 게시판을 조회해줘":
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "이수체계도를 조회했어요!"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "교수진소개 게시판을 조회해줘":
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "교수진소개를 조회했어요!"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        default:
            break;
    }

    res
        .status(201)
        .send(responseBody);
});

module.exports = router;