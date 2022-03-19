const express = require('express');
const router = express.Router();
const startAuth = require('../start_auth');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const checkAuth = await startAuth(userAbout); // 이메일 인증을 통한 프로필 설정 확인

    let responseBody; // 응답 블록 구조
    const quickReplies = []; // 바로가기 그룹
    const messageText = ["해당 키워드를 조회해줘", "해당 키워드를 조회해줘", "해당 키워드를 조회해줘"]; // 바로가기 요청문
    const label = ["키워드", "키워드2", "키워드3"]; // 바로가리 버튼명

    if (checkAuth == true) { // 프로필 설정이 되어있다면
        label.forEach((value, index) => {
            quickReplies.push({
                "messageText": messageText[index],
                "action": "block",
                "blockId": functions
                    .config()
                    .service_url
                    .personal_key,
                "label": value
            }); // 바로가기 그룹 작성
        });
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "💬 원하시는 메뉴를 선택해주세요." // 학과 전용 서비스 첫 질문
                        }
                    }
                ],
                quickReplies: quickReplies
            }
        };
    } else {
        responseBody = checkAuth; // 프로필 설정이 안되었다면 누락 설정 블록으로
    }
    res
        .status(201)
        .send(responseBody); // 응답 전송
});

module.exports = router;