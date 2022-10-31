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
    // console.log(checkAuth);
    let responseBody;
    const quickReplies = [];
    let messageText = [];
    let label = [];

    if (checkAuth === true) {
        /* 사용자 프로필 DB 조회*/
        const firestore = admin.firestore();
        const userSelect = firestore
            .collection('users')
            .doc(userAbout.plusfriendUserKey);
        const userData = await userSelect.get();

        /* 학점 값 데이터 유무에 따라 메뉴 바로가기 내용 개별 구성 */
        if (!userData.data().credits) {
            messageText.push("나의 학점을 입력할게", "나의 학번을 변경할게", "나의 공학인증여부를 변경할게", "설정을 초기화 해줘");
            label.push("학점 입력", "학번 변경", "공학인증 변경", "설정 초기화");
            label.forEach((value, index) => {
                /* 직접 입력과 버튼 입력 등 서로 다른 스타일의 설정 메뉴 버튼 블록 주소 개별 지정 */
                if (index === 0) {
                    quickReplies.push({
                        "messageText": messageText[index],
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_key
                            .credit,
                        "label": value
                    });
                } else if (index === 1) {
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
        } else {
            messageText.push("나의 학점을 수정할게", "전체 학점을 삭제할게", "나의 학번을 변경할게", "나의 공학인증여부를 변경할게", "설정을 초기화 해줘");
            label.push("학점 수정", "전체 학점 삭제", "학번 변경", "공학인증 변경", "설정 초기화");
            label.forEach((value, index) => {
                 if (index === 2) {
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

        /* 사용자의 공학인증, 학점 입력 상태를 문자열로 표기하기 위해 삼항연산자로 해당 내용 작성*/
        const title = ["이메일", "학번", "공학인증", "학점입력"];
        const description = [
            userData
                .data()
                .email,
            userData
                .data()
                .studentID,
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
        /* 아이템 카드 뷰 블록으로 본문 내용 작성 및 출력*/
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
                        itemCard: {
                            imageTitle: { // 사용자의 프로필 UI를 첫번째로 출력
                                "title": "프로필 설정",
                                "imageUrl": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_96" +
                                    "0_720.png"
                            },
                            itemList: itemList
                        }
                    }
                ],
                quickReplies: quickReplies
            }
        };
    } else {
        responseBody = checkAuth;
    }
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;