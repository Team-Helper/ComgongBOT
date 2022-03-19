const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    // console.log(req.body.userRequest.user.id);
    const userAbout = req.body.userRequest.user.properties; // 사용자 정보
    // console.log(userAbout);
    const userRequest = req.body.userRequest.utterance; // 사용자 요청문
    // console.log(userRequest);
    let responseBody; // 응답 블록 구조
    const quickReplies = [
        {
            // 뒤로가기 버튼
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

    switch (userRequest) { // 사용자 요청문 내용에 따른 개별 처리
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
                    .credits
                    .majorA,
                userData
                    .data()
                    .credits
                    .majorB,
                userData
                    .data()
                    .credits
                    .geA,
                userData
                    .data()
                    .credits
                    .geB,
                userData
                    .data()
                    .credits
                    .total
            ];
            const itemList = [];

            title.forEach((value, index) => {
                itemList.push({"title": value, "description": description[index]}); // 학점 조회 뷰 바로가기 그룹 작성
            });
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            itemCard: { // 아이템 카드 뷰로 사용자가 입력한 학점 총 출력
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
        .send(responseBody); // 응답 전송
});

module.exports = router;