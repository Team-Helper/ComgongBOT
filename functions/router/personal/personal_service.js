const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    // console.log(req.body.userRequest.user.id);
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout);
    const userRequest = req.body.userRequest.utterance; // 사용자 요.청문
    console.log(userRequest);
    let responseBody; // 응답 블록 구조
    const quickReplies = [
        {
            // 바로가기 버튼 저장
            "messageText": "뒤로 돌아갈래",
            "action": "block",
            "blockId": functions
                .config()
                .service_url
                .personalhub_key,
            "label": "🔙 뒤로가기"
        }
    ];
    // console.log(itemList);

    switch (userRequest) {
        case "나의 누적 학점을 알려줘":
            const firestore = admin.firestore();
            const userSelect = firestore
                .collection('users')
                .doc(userAbout.plusfriendUserKey);
            const userData = await userSelect.get();
            const title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
            const description = [
                userData
                    .data()
                    .credits[0]
                    .majorA,
                userData
                    .data()
                    .credits[0]
                    .majorB,
                userData
                    .data()
                    .credits[0]
                    .geA,
                userData
                    .data()
                    .credits[0]
                    .geB,
                userData
                    .data()
                    .credits[0]
                    .total
            ];
            const itemList = [];

            title.forEach((value, index) => {
                itemList.push({"title": value, "description": description[index]});
            });
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            itemCard: {
                                "head": {
                                    "title": "☑ 누적 학점 조회"
                                },
                                "itemList": itemList,
                                "title": "학점은 설정을 통해 언제든지 수정이 가능합니다."
                            }
                        }
                    ],
                    quickReplies: quickReplies
                }
            };
            break;
        case "졸업까지 남은 학점을 계산해줘":
            break;
        case "교과목별 최저이수 요구학점을 알려줘":
            break;
        default:
            break;
    }
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;