const express = require('express');
const router = express.Router();
const startAuth = require('../start_auth');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const checkAuth = await startAuth(userAbout); // 이메일 인증 등의 프로필 설정 확인하기
    console.log(checkAuth);

    let responseBody; // 응답 블록 구조
    const quickReplies = []; // 바로가기 그룹
    const messageText = ["나의 학점을 수정할게", "나의 학번을 변경할게", "나의 학적상태를 변경할게", "설정을 초기화 해줘"];
    const label = ["학점 수정", "학번 변경", "학적상태 변경", "설정 초기화"];

    if (checkAuth == true) {
        label.forEach((value, index) => {
            quickReplies.push({
                "messageText": messageText[index],
                "action": "block",
                "blockId": functions
                    .config()
                    .service_url
                    .setting_key,
                "label": value
            }); // 바로가기 그룹 작성
        });
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "💬 원하시는 메뉴를 선택해주세요."
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
        .send(responseBody);
});

module.exports = router;