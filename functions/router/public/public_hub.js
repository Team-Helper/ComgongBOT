const express = require('express');
const router = express.Router();
const startAuth = require('../start_auth');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const checkAuth = await startAuth(userAbout); // 이메일 인증을 통한 프로필 설정 확인
    // console.log(checkAuth);
    
    let responseBody; // 응답 블록 구조
    const quickReplies = []; // 바로가기 그룹
    const messageText = [ // 바로가기 요청문
        "공지사항 게시판을 조회해줘",
        "새소식 게시판을 조회해줘",
        "자유게시판을 조회해줘",
        "외부IT행사 및 교육 게시판을 조회해줘",
        "공학인증자료실 게시판을 조회해줘",
        "교과과정을 조회해줘",
        "올해 이수체계도를 조회해줘",
        "교수진소개 게시판을 조회해줘"
    ];
    const label = [ // 바로가기 버튼명
        "공지사항",
        "새소식",
        "자유게시판",
        "외부IT행사 및 교육",
        "공학인증 자료실",
        "교과과정",
        "이수체계도",
        "교수진소개"
    ];

    if (checkAuth == true) { // 사용자가 프로필 설정이 되어있다면
        /* 바로가기 작성*/
        label.forEach((value, index) => {
            quickReplies.push({
                "messageText": messageText[index],
                "action": "block",
                "blockId": functions
                    .config()
                    .service_key
                    .public_key,
                "label": value
            });
        });

        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "💬 원하시는 학과 메뉴를 선택해주세요." // 텍스트 뷰 블록으로 출력
                        }
                    }
                ],
                quickReplies: quickReplies // 바로가기 출력
            }
        };
    } else {
        responseBody = checkAuth; // 프로필 설정이 안되었다면 누락 설정 블록으로
    }
    res
        .status(201)
        .send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;