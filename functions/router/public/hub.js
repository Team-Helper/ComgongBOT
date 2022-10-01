const express = require('express');
const router = express.Router();
const startAuth = require('../start-auth');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    /* 사용자의 카카오 채널 추가 상태와 이메일 인증 여부를 통해 메뉴 바로가기 혹은 경고문 출력 */
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const checkAuth = await startAuth(userAbout);
    // console.log(checkAuth);

    let responseBody;
    const quickReplies = [];
    const messageText = [
        "공지사항 게시판을 조회해줘",
        "새소식 게시판을 조회해줘",
        "자유게시판을 조회해줘",
        "외부IT행사 및 교육 게시판을 조회해줘",
        "공학인증자료실 게시판을 조회해줘",
        "교과과정을 조회해줘",
        "올해 이수체계도를 조회해줘",
        "교수진소개 게시판을 조회해줘"
    ];
    const label = [
        "공지사항",
        "새소식",
        "자유게시판",
        "외부IT행사 및 교육",
        "공학인증 자료실",
        "교과과정",
        "이수체계도",
        "교수진소개"
    ];

    if (checkAuth === true) {
        /* 바로가기 내용 작성 및 출력*/
        label.forEach((value, index) => {
            quickReplies.push({
                "messageText": messageText[index],
                "action": "block",
                "blockId": functions
                    .config()
                    .service_key
                    .public,
                "label": value
            });
        });

        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "💬 원하시는 학과 메뉴를 선택해주세요."
                        }
                    }
                ],
                quickReplies: quickReplies
            }
        };
    } else {
        responseBody = checkAuth;
    }
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;