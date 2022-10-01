const express = require('express');
const router = express.Router();
const startAuth = require('../start-auth');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    /* 사용자의 카카오 채널 추가 상태와 이메일 인증 여부를 통해 메뉴 바로가기 혹은 경고문 출력 */
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const checkAuth = await startAuth(userAbout);

    let responseBody;
    const quickReplies = [];
    const messageText = ["나의 누적 학점을 알려줘", "졸업까지 남은 학점을 계산해줘", "나의 졸업조건을 알려줘"];
    const label = ["학점 조회", "졸업학점 계산", "졸업이수 조건 확인"];

    /* 사용자 프로필 DB 조회*/
    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    const userData = await userSelect.get();

    if (checkAuth === true) {
        /* 프로필 DB에 학점 데이터 존재 유무에 따라 메뉴 바로가기 혹은 경고문 출력 */
        if (!userData.data().credits) {
            const title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
            const description = "❌ 미설정";
            const itemList = [];

            /* 아이템 카드 뷰 블록 본문 내용 작성 및 출력 */
            title.forEach(value => {
                itemList.push({"title": value, "description": description});
            });
            responseBody = {
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
                            /* 학점 입력 바로가기 작성 및 출력 */
                            "messageText": "학점 입력할게",
                            "action": "block",
                            "blockId": functions
                                .config()
                                .service_key
                                .credit,
                            "label": "학점 입력"
                        }
                    ]
                }
            };
        } else {
            /* 메뉴 바로가기 내용 작성 및 출력*/
            label.forEach((value, index) => {
                quickReplies.push({
                    "messageText": messageText[index],
                    "action": "block",
                    "blockId": functions
                        .config()
                        .service_key
                        .personal,
                    "label": value
                });
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
        responseBody = checkAuth;
    }
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;