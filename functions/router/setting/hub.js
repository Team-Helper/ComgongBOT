const express = require('express');
const router = express.Router();
const startAuth = require('../start-auth');
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

    if (checkAuth === true) { // 사용자가 프로필 설정이 되어있다면
        /* 사용자 프로필 DB 조회*/
        const firestore = admin.firestore();
        const userSelect = firestore
            .collection('users')
            .doc(userAbout.plusfriendUserKey);
        const userData = await userSelect.get();

        if (!userData.data().credits) { // 학점 값이 없는 사용자 일 경우
            /* 바로가기 작성*/
            messageText.push(
                "나의 학점을 입력할게",
                "나의 학번을 변경할게",
                "나의 공학인증여부를 변경할게",
                "설정을 초기화 해줘"
            );
            label.push("학점 입력", "학번 변경", "공학인증 변경", "설정 초기화");
            label.forEach((value, index) => {
                if (index === 0) { // 학점 입력 경우 파라미터를 사용한 블록 주소로 설정
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_key
                            .credit,
                        "label": value
                    });
                } else if (index === 2) { // 학번 변경 경우 파라미터를 사용한 블록 주소로 설정
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_key
                            .studentID_modify,
                        "label": value
                    });
                } else {
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_key
                            .setting,
                        "label": value
                    });
                }
            });
        } else { // 학점 값이 있는 사용자 경우
            messageText.push(
                "나의 학점을 수정할게",
                "나의 학번을 변경할게",
                "나의 공학인증여부를 변경할게",
                "설정을 초기화 해줘"
            );
            label.push("학점 수정", "학번 변경", "공학인증 변경", "설정 초기화");
            label.forEach((value, index) => {
                if (index === 0) { // 학점 수정 경우 파라미터를 사용한 블록 주소로 설정
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_key
                            .credit_modify,
                        "label": value
                    });
                } else if (index === 2) { // 학번 변경 경우 파라미터를 사용한 블록 주소로 설정
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_key
                            .studentID_modify,
                        "label": value
                    });
                } else {
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_key
                            .setting,
                        "label": value
                    });
                }
            });
        }
        /* 사용자 학점 입력 값 배열 처리*/
        const title = ["이메일", "학번", "공학인증", "학점입력"];
        const description = [
            userData
                .data()
                .email,
            userData
                .data()
                .studentID,
            /* 사용자의 공학인증, 학점 입력 상태에 따라 문자열을 표기하는 삼항연산자 작성*/
            userData
                .data()
                .engineeringStatus = (userData.data().engineeringStatus === true)
                    ? 'O'
                    : 'X',
            userData
                .data()
                .credits = (!userData.data().credits)
                    ? '미입력'
                    : '입력'
        ];
        /* 아이템 카드 뷰 본문 작성*/
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
                                "imageUrl": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_96" +
                                    "0_720.png"
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