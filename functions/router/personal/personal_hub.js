const express = require('express');
const router = express.Router();
const startAuth = require('../start_auth');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const checkAuth = await startAuth(userAbout); // 이메일 인증을 통한 프로필 설정 확인

    let responseBody; // 응답 블록 구조
    const quickReplies = []; // 바로가기 그룹
    const messageText = ["나의 누적 학점을 알려줘", "졸업까지 남은 학점을 계산해줘", "교과목별 최저이수 요구학점을 알려줘"]; // 바로가기 요청문
    const label = ["학점 조회", "졸업학점 계산", "졸업이수 조건 확인"]; // 바로가기 버튼명

    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey); // 사용자 프로필 DB 조회
    const userData = await userSelect.get(); // DB 데이터 GET

    if (checkAuth == true) { // 사용자가 프로필 설정이 되어있다면
        if (!userData.data().credits) { // 프로필 DB에 학점 데이터가 존재하지 않는다면
            const title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
            const description = "❌ 미설정";
            const itemList = [];

            title.forEach(value => {
                itemList.push({"title": value, "description": description});
            });
            responseBody = { // 누락 설정 블록 처리
                version: "2.0",
                template: {
                    outputs: [
                        {
                            itemCard: {
                                "head": {
                                    "title": "⚠ 누락된 설정이 있습니다."
                                },
                                "itemList": itemList,
                                "title": "학과 개인 서비스는 학점 입력이 완료되어야 이용이 가능해집니다."
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "학점 입력할게",
                            "action": "block",
                            "blockId": functions
                                .config()
                                .service_url
                                .credit_key,
                            "label": "학점 입력"
                        }
                    ]
                }
            };
        } else { // 프로필 DB에 학점 데이터가 존재한다면
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
                                text: "💬 원하시는 메뉴를 선택해주세요."
                            }
                        }
                    ],
                    quickReplies: quickReplies
                }
            };
        }
    } else {
        responseBody = checkAuth; // 프로필 설정이 안되었다면 누락 설정 블록으로
    }
    res
        .status(201)
        .send(responseBody); // 응답 전송
});

module.exports = router;