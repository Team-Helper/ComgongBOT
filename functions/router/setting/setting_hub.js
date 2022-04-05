const express = require('express');
const router = express.Router();
const startAuth = require('../start_auth');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const checkAuth = await startAuth(userAbout); // 이메일 인증을 통한 프로필 설정 확인
    // console.log(checkAuth);
    let responseBody; // 응답 블록 구조
    const quickReplies = []; // 바로가기 그룹
    let messageText = []; // 바로가기 요청문
    let label = []; // 바로가기 버튼명

    if (checkAuth == true) { // 사용자가 프로필 설정이 되어있다면
        /*사용자 프로필 DB 조회*/
        const firestore = admin.firestore();
        const userSelect = firestore
            .collection('users')
            .doc(userAbout.plusfriendUserKey);
        const userData = await userSelect.get();

        if (!userData.data().credits) { // 학점 값이 없는 사용자 일 경우
            /*바로가기 작성*/
            messageText.push("나의 학년을 변경할게", "나의 학번을 변경할게", "나의 학적상태를 변경할게", "설정을 초기화 해줘")
            label.push("학년 변경", "학번 변경", "학적상태 변경", "설정 초기화");
            label.forEach((value, index) => {
                if (index == 2) { // 학번 변경 경우 파라미터를 사용한 블록 주소로 설정
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_url
                            .studentid_modify_key,
                        "label": value
                    });
                } else {
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_url
                            .setting_key,
                        "label": value
                    });
                }
            });
        } else { // 학점 값이 있는 사용자 경우
            messageText.push(
                "나의 학점을 수정할게",
                "나의 학년을 변경할게",
                "나의 학번을 변경할게",
                "나의 학적상태를 변경할게",
                "설정을 초기화 해줘"
            );
            label.push("학점 수정", "학년 변경", "학번 변경", "학적상태 변경", "설정 초기화");
            label.forEach((value, index) => {
                if (index == 0) { // 학점 수정 경우 파라미터를 사용한 블록 주소로 설정
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_url
                            .credit_modify_key,
                        "label": value
                    });
                } else if (index == 2) {
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_url
                            .studentid_modify_key,
                        "label": value
                    });
                } else {
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_url
                            .setting_key,
                        "label": value
                    });
                }
            });
        }
        /*사용자 학점 입력 값 배열 처리*/
        const title = ["이메일", "학년/학번", "학적상태", "학점입력"];
        const description = [
            userData
                .data()
                .email,
            userData
                .data()
                .grade + '/' + userData
                .data()
                .studentID, // 학년과 학번은 하나의 문자로 처리
            userData
                .data()
                .status,
            userData
                .data()
                .credits
        ]
        description[description.length - 2] = ( // 사용자 재학 상태 값을 T/F로 나누어 재학/휴학으로 처리
                description[description.length - 2] === true)
            ? '재학'
            : '휴학';
        description[description.length - 1] = ( // 사용자 학점 입력 상태에 따른 미설정/설정으로 처리
                !description[description.length - 1])
            ? '미입력'
            : '입력';
        /*아이템 카드 뷰 본문 작성*/
        const itemList = [];
        title.forEach((value, index) => {
            itemList.push({"title": value, "description": description[index]});
        });
        // console.log(itemList);
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        itemCard: { // 아이템 카드 뷰 블록으로 출력
                            imageTitle: { // 설정 서비스 경우 사용자의 프로필을 첫번째로 출력
                                "title": "프로필 설정",
                                "imageUrl": "https://pixabay.com/get/g52adf5f3d0c49d960af25a1881181b38ae144f96c845ec34874db" +
                                    "53ef268324954a49df11f8e954aa36312663fb8a91affa2bd50adf637897eadb6a98fb15ecf1b1" +
                                    "0dfe05fe18a44d0cb7994276c6a90_640.png"
                            },
                            itemList: itemList
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