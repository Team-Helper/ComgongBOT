const express = require('express');
const router = express.Router();

router.post('/', function (req, res) {
    // console.log(req.headers.key);
    const responseBody = {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: { // comgongbot 질문 텍스트
                        text: "💬 원하시는 학과 메뉴를 선택해주세요"
                    }
                }
            ],
            quickReplies: [ // 바로가기 버튼 그룹
                {
                    "messageText": "공지사항 게시판을 조회해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "공지사항"
                }, {
                    "messageText": "새소식 게시판을 조회해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "새소식"
                }, {
                    "messageText": "자유게시판을 조회해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "자유게시판"
                }, {
                    "messageText": "외부IT행사 및 교육 게시판을 조회해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "외부IT행사 및 교육"
                }, {
                    "messageText": "공학인증자료실 게시판을 조회해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "공학인증자료실"
                }, {
                    "messageText": "교과과정을 조회해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "교과과정"
                }, {
                    "messageText": "올해 이수체계도를 조회해줘",
                    "action": "block",
                    "blockId": req.headers.key,
                    "label": "이수체계도"
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