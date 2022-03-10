const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    // console.log(req.body.userRequest.user.id);
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout);
    const userRequest = req.body.userRequest.utterance;
    // console.log(userRequest);
    let responseBody;
    let quickReplies = [];
    let items = [];
    let firestore = admin.firestore();
    let userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);

    switch (userRequest) {
        case "나의 학점을 수정할게":
            items.push(['전공필수', '전공선택', '교양필수', '교양선택', '총 학점']);
            items.forEach((value) => {
                quickReplies.push({
                    "messageText": value,
                    "action": "block",
                    "blockId": functions
                        .config()
                        .service_url
                        .setting_key,
                    "label": value
                });
            });
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "수정하고자 하는 학점을 선택해주세요"
                            }
                        }
                    ],
                    quickReplies: quickReplies
                }
            }
            break;
        case "전공필수":
            changeCredit('majorA');
            break;
        case "전공선택":
            changeCredit('majorB');
            break;
        case "교양필수":
            changeCredit('geA');
            break;
        case "교양선택":
            changeCredit('geB');
            break;
        case "총 학점":
            changeCredit('total');
            break;

        case "나의 학년을 변경할게":
            await userSelect.update({grade: 'change!'});
            break;

        case "나의 학번을 변경할게":
            await userSelect.update({studentID: 'change!'});
            break;
            
        case "나의 학적상태를 변경할게":
            items.push(['휴학해요', '자퇴해요', '뒤로 돌아갈래']);
            items.forEach((value) => {
                quickReplies.push({
                    "messageText": value,
                    "action": "block",
                    "blockId": functions
                        .config()
                        .service_url
                        .setting_key,
                    "label": value
                });
            });
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "현재 학교에 어떤 상태로 계신가요? (자퇴해요 클릭 시 설정이 초기화 됩니다.)"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "휴학해요",
                            "action": "block",
                            "blockId": functions
                                .config()
                                .service_url
                                .setting_key,
                            "label": "휴학해요"
                        }, {
                            "messageText": "자퇴해요",
                            "action": "block",
                            "blockId": functions
                                .config()
                                .service_url
                                .setting_key,
                            "label": "자퇴해요"
                        }, {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": functions
                                .config()
                                .service_url
                                .settinghub_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "휴학해요":
            await userSelect.update({status: false});
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "학적상태를 휴학으로 변경완료 하였습니다!"
                            }
                        }
                    ],
                    quickReplies: quickReplies
                }
            }
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
                                .settinghub_key,
                            "label": "아니오"
                        }
                    ]
                }
            }
            break;
        case "네":
        case "자퇴해요":
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
                    // console.log('Successfully deleted user');
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

    async function changeCredit(params) {
        console.log(params);
        // await userSelect.update({params: false});
    }
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;