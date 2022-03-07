const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    // console.log(req.body.userRequest.user.id);
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout);
    const userRequest = req.body.userRequest.utterance; // 사용자 요.청문
    // console.log(userRequest);
    let responseBody; // 응답 블록 구조
    const quickReplies = [
        {
            // 바로가기 버튼 저장
            "messageText": "뒤로 돌아갈래",
            "action": "block",
            "blockId": functions
                .config()
                .service_url
                .settinghub_key,
            "label": "🔙 뒤로가기"
        }
    ];

    switch (userRequest) {
        case "나의 학점을 수정할게":
            break;
        case "나의 학년을 변경할게":
            break;
        case "나의 학번을 변경할게":
            break;
        case "나의 학적상태를 변경할게":
            break;
        case "설정을 초기화 해줘":
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "‼ 전체 설정이 초기화 됩니다. 정말 진행을 원하시나요?"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "네",
                            "action": "block",
                            "blockId": functions
                                .config()
                                .service_url
                                .setting_key,
                            "label": "네"
                        }, {
                            "messageText": "아니오",
                            "action": "block",
                            "blockId": functions
                                .config()
                                .service_url
                                .back_key,
                            "label": "아니오"
                        }
                    ]
                }
            }
            break;
        case "네":
            const firestore = admin.firestore();
            const userSelect = firestore
                .collection('users')
                .doc(userAbout.plusfriendUserKey);
            const userData = await userSelect.get();
            const getEmail = userData
                .data()
                .email;
            const userUid = await admin
                .auth()
                .getUserByEmail(getEmail)
                .then(userRecord => {
                    // console.log(userRecord);
                    return userRecord.uid;
                })
                .catch(e => {
                    console.error('Error get user uid:', e);
                });
            // console.log(userUid);
            await admin
                .auth()
                .deleteUser(userUid)
                .then(() => {
                    userSelect.delete();
                    console.log('Successfully deleted user');
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    simpleText: {
                                        text: "🗑 전체 설정이 초기화 되었습니다."
                                    }
                                }
                            ]
                        }
                    }
                })
                .catch((e) => {
                    console.log('Error deleting user:', e);
                });
            break
        default:
            break;
    }
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;