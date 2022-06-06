const express = require('express');
const router = express.Router();
const functions = require('firebase-functions');
const startAuth = require('../start-auth');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.userRequest.utterance; // 사용자 요청문
    const checkAuth = await startAuth(userAbout); // 이메일 인증을 통한 프로필 설정 확인
    let responseBody; // 응답 블록 구조
    const quickReplies = [
        {
            // 바로가기 작성
            "messageText": "뒤로 돌아갈래",
            "action": "block",
            "blockId": functions
                .config()
                .service_key
                .private_hub,
            "label": "↩ 뒤로가기"
        }
    ];

    if (checkAuth === true) { // 사용자가 프로필 설정이 되어있다면
        switch (userRequest) { // 사용자 요청문 내용에 따른 개별 처리
            case "단톡 공지사항을 조회해줘":
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "현재 해당 서비스는 개발 진행하고 있습니다." // 텍스트 뷰 블록으로 출력
                                }
                            }
                        ],
                        quickReplies: quickReplies // 바로가기 출력
                    }
                };
                break;
            case "분실문 신고 내역을 조회해줘":
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "현재 해당 서비스는 개발 진행하고 있습니다."
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;
            case "학과 SNS 공지사항을 조회해줘":
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "현재 해당 서비스는 개발 진행하고 있습니다."
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;

            default:
                break;
        }
    } else {
        responseBody = checkAuth; // 프로필 설정이 안되었다면 누락 설정 블록으로
    }

    res
        .status(201)
        .send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;