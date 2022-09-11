const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const startAuth = require('../start-auth');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.userRequest.utterance; // 사용자 요청문
    const checkAuth = await startAuth(userAbout); // 이메일 인증을 통한 프로필 설정 확인
    // console.log(userRequest);
    let responseBody; // 응답 블록 구조
    let quickReplies = []; // 바로가기 그룹
    let items; // 바로가기 본문
    let label; // 바로가기 버튼명
    /* 사용자 프로필 DB 조회*/
    let firestore = admin.firestore();
    let userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    let userData;

    if (checkAuth === true) { // 사용자가 프로필 설정이 되어있다면
        switch (userRequest) { // 사용자 요청문 내용에 따른 개별 처리
            case "나의 학적상태를 변경할게":
                items = ['휴학해요', '재학해요', '자퇴해요', '뒤로 돌아갈래'];
                label = ['휴학해요', '재학해요', '자퇴해요', '↩ 뒤로가기'];
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
                                    text: "변경하고자 하는 학적상태로 선택해주세요.(❗ 자퇴해요 선택 시 설정이 초기화 됩니다.)"
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;
            case "휴학해요":
                userData = await userSelect.get();
                items = ['나의 학적상태를 변경할게'];
                label = ['↩ 뒤로가기'];
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
                if (userData.data().status === false) { // 이미 사용자가 휴학 상태이면
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    simpleText: {
                                        text: "🚫 이미 학적상태가 휴학중 이예요!"
                                    }
                                }
                            ],
                            quickReplies: quickReplies
                        }
                    };
                } else { // 아닌 경우 사용자의 학적상태를 휴학으로 변경 및 응답 블록 출력
                    await userSelect.update({status: false});
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    simpleText: {
                                        text: "🔄 학적상태를 휴학으로 변경완료 하였습니다."
                                    }
                                }
                            ]
                        }
                    };
                }
                break;
            case "재학해요":
                userData = await userSelect.get();
                items = ['나의 학적상태를 변경할게'];
                label = ['↩ 뒤로가기'];
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
                if (userData.data().status === true) { // 이미 사용자가 재학 상태이면
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    simpleText: {
                                        text: "🚫 이미 학적상태가 재학중 이예요!"
                                    }
                                }
                            ],
                            quickReplies: quickReplies
                        }
                    };
                } else { // 아닌 경우 사용자의 학적상태를 재학으로 변경 및 응답 블록 출력
                    await userSelect.update({status: true});
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    simpleText: {
                                        text: "🔄 학적상태를 재학으로 변경완료 하였습니다."
                                    }
                                }
                            ]
                        }
                    };
                }
                break;

            case "나의 공학인증여부를 변경할게":
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
            case "네":
            case "자퇴해요":
                {
                    userData = await userSelect.get();
                    const getEmail = userData
                        .data()
                        .email; // 사용자 AUTH의 이메일 주소 get
                    const userUid = await admin
                        .auth()
                        .getUserByEmail(getEmail)
                        .then(userRecord => {
                            // console.log(userRecord);
                            return userRecord.uid; // 사용자 이메일 주소를 통한 사용자의 udi 값 get
                        })
                        .catch(err => {
                            console.error('Error get user uid:', err);
                        });
                    // console.log(userUid);
                    await admin
                        .auth()
                        .deleteUser(userUid) // 해당 uid 값으로 사용자 AUTH 삭제
                        .then(() => {
                            userSelect.delete(); // 마찬가지로 사용자 프로필 DB도 삭제 및 응답 블록 출력
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
        responseBody = checkAuth; // 프로필 설정이 안되었다면 누락 설정 블록으로
    }

    res
        .status(201)
        .send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;