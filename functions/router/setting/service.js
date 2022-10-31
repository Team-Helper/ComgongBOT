const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const startAuth = require('../start-auth');

router.post('/', async function (req, res) {
    /* 사용자의 카카오 채널 추가 상태와 이메일 인증 여부를 통해 사용자가 요청한 설정 서비스 실행 혹은 경고문 출력 */
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.userRequest.utterance;
    const checkAuth = await startAuth(userAbout);
    // console.log(userRequest);
    let responseBody;
    let quickReplies = [];
    let items;
    let label;
    /* 사용자 프로필 DB 조회*/
    let firestore = admin.firestore();
    let userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    let userData;

    if (checkAuth === true) {
        switch (userRequest) {
            case "전체 학점을 삭제할게":
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "전체 학점을 삭제합니다. 진행하시겠습니까?"
                                }
                            }
                        ],
                        quickReplies: [
                            {
                                "messageText": "네, 삭제해주세요",
                                "action": "block",
                                "blockId": functions
                                    .config()
                                    .service_key
                                    .setting,
                                "label": "네"
                            }, {
                                "messageText": "아니오",
                                "action": "block",
                                "blockId": functions
                                    .config()
                                    .service_key
                                    .setting_hub,
                                "label": "아니오"
                            }
                        ]
                    }
                };
                break;
            case "네, 삭제해주세요":
                userData = await userSelect.get();
                items = ["나의 학점을 입력할게"];
                label = ["학점 입력"];
                items.forEach((value, index) => {
                    quickReplies.push({
                        "messageText": value,
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_key
                            .credit,
                        "label": label[index]
                    });
                });
                if (userData.data().credits) {
                    await userSelect.update({credits: admin.firestore.FieldValue.delete()});
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    simpleText: {
                                        text: "🔄 전체 학점이 삭제되었습니다."
                                    }
                                }
                            ]
                        }
                    };
                } else {
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    simpleText: {
                                        text: "🚫 학점이 존재하지 않습니다."
                                    }
                                }
                            ],
                            quickReplies: quickReplies
                        }
                    };
                }
                break;
            case "나의 공학인증여부를 변경할게":
                /* 사용자의 공학인증 여부를 O/x 바로가기 버튼으로 처리하여 상태 값을 Flag 처리*/
                /* 또한, 해당 상태 값의 중복 검사 역시 도입 */
                items = ['공학인증 해요', '공학인증 안해요', '뒤로 돌아갈래'];
                label = ['O', 'X', '↩ 뒤로가기'];
                items.forEach((value, index) => {
                    if (index === items.length - 1) {
                        quickReplies.push({
                            "messageText": value,
                            "action": "block",
                            "blockId": functions
                                .config()
                                .service_key
                                .setting_hub,
                            "label": label[index]
                        });
                    } else {
                        quickReplies.push({
                            "messageText": value,
                            "action": "block",
                            "blockId": functions
                                .config()
                                .service_key
                                .setting,
                            "label": label[index]
                        });
                    }
                });
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "변경하고자 하는 공학인증여부로 선택해주세요."
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;
            case "공학인증 해요":
                userData = await userSelect.get();
                items = ["나의 공학인증여부를 변경할게"];
                label = ["↩ 뒤로가기"];
                items.forEach((value, index) => {
                    quickReplies.push({
                        "messageText": value,
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_key
                            .setting,
                        "label": label[index]
                    });
                });
                if (userData.data().engineeringStatus === true) {
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    simpleText: {
                                        text: "🚫 이미 공학인증을 하고 있어요!"
                                    }
                                }
                            ],
                            quickReplies: quickReplies
                        }
                    };
                } else {
                    await userSelect.update({engineeringStatus: true});
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    simpleText: {
                                        text: "🔄 공학인증여부를 공학인증 진행으로 변경완료 하였습니다."
                                    }
                                }
                            ]
                        }
                    };
                }
                break;
            case "공학인증 안해요":
                userData = await userSelect.get();
                items = ["나의 공학인증여부를 변경할게"];
                label = ["↩ 뒤로가기"];
                items.forEach((value, index) => {
                    quickReplies.push({
                        "messageText": value,
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_key
                            .setting,
                        "label": label[index]
                    });
                });
                if (userData.data().engineeringStatus === false) {
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    simpleText: {
                                        text: "🚫 이미 공학인증을 하지 않고 있어요!"
                                    }
                                }
                            ],
                            quickReplies: quickReplies
                        }
                    };
                } else {
                    await userSelect.update({engineeringStatus: false});
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    simpleText: {
                                        text: "🔄 공학인증여부를 공학인증 미진행으로 변경완료 하였습니다."
                                    }
                                }
                            ]
                        }
                    };
                }
                break;

            case "설정을 초기화 해줘":
                /* 사용자의 요청에 따라 설정 초기화에는 사용자의 이메일 인증 값을 삭제하고 프로필 DB를 삭제 */
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
                                "messageText": "네, 초기화해주세요",
                                "action": "block",
                                "blockId": functions
                                    .config()
                                    .service_key
                                    .setting,
                                "label": "네"
                            }, {
                                "messageText": "아니오",
                                "action": "block",
                                "blockId": functions
                                    .config()
                                    .service_key
                                    .setting_hub,
                                "label": "아니오"
                            }
                        ]
                    }
                };
                break;
            case "네, 초기화해주세요":
                {
                    userData = await userSelect.get();
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
                        .catch(err => {
                            console.error('Error get user uid:', err);
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
                            };
                        })
                        .catch((err) => {
                            console.error('Error deleting user:', err);
                        });
                    break;
                }

            default:
                break;
        }
    } else {
        responseBody = checkAuth;
    }

    res
        .status(201)
        .send(responseBody);
});

module.exports = router;