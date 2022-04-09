const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    // console.log(req.body.userRequest.user.id);
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout);
    const userRequest = req.body.userRequest.utterance; // 사용자 요청문
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

    switch (userRequest) { // 사용자 요청문 내용에 따른 개별 처리
        case "나의 학년을 변경할게":
            items = ['1학년', '2학년', '3학년', '4학년', '뒤로 돌아갈래'];
            label = ['1학년', '2학년', '3학년', '4학년', '↩ 뒤로가기'];
            items.forEach((value, index) => {
                if (index == items.length - 1) { // 뒤로가기는 해당 내용의 블록 아이디 값으로
                    quickReplies.push({
                        "messageText": value,
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_url
                            .settinghub_key,
                        "label": label[index]
                    });
                } else {
                    quickReplies.push({
                        "messageText": value,
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_url
                            .setting_key,
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
                                text: "변경하고자 하는 학년으로 선택해주세요." // 텍스트 뷰 블록으로 출력
                            }
                        }
                    ],
                    quickReplies: quickReplies // 바로가기 출력
                }
            }
            break;
        case "1학년":
        case "2학년":
        case "3학년":
        case "4학년":
            userData = await userSelect.get();
            items = ['나의 학년을 변경할게'];
            label = ['↩ 뒤로가기'];
            items.forEach((value, index) => {
                quickReplies.push({ // 뒤로가기 버튼
                    "messageText": value,
                    "action": "block",
                    "blockId": functions
                        .config()
                        .service_url
                        .setting_key,
                    "label": label[index]
                });
            });
            const gradeNumber = userRequest.replace("학년", ""); // 사용자 입력 값에서 '학년' 글자는 제거
            if (userData.data().grade === gradeNumber) { // 입력한 학년이 기존의 학년 값과 같을 경우
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "🚫 이미 같은 학년 이예요!"
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                }
            } else { // 아닌 경우 사용자의 학년 데이터를 변경 및 응답 블록 출력
                await userSelect.update({grade: `${gradeNumber}`});
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "🔄 선택하신 학년으로 변경이 완료되었습니다."
                                }
                            }
                        ],
                    }
                }
            }
            break;

        case "나의 학적상태를 변경할게":
            items = ['휴학해요', '재학해요', '자퇴해요', '뒤로 돌아갈래'];
            label = ['휴학해요', '재학해요', '자퇴해요', '↩ 뒤로가기'];
            items.forEach((value, index) => {
                if (index == items.length - 1) {
                    quickReplies.push({
                        "messageText": value,
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_url
                            .settinghub_key,
                        "label": label[index]
                    });
                } else {
                    quickReplies.push({
                        "messageText": value,
                        "action": "block",
                        "blockId": functions
                            .config()
                            .service_url
                            .setting_key,
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
                                text: "변경하고자 하는 학적상태로 선택해주세요.\n\n❗ 자퇴해요 클릭 시 설정이 초기화 됩니다."
                            }
                        }
                    ],
                    quickReplies: quickReplies
                }
            }
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
                        .service_url
                        .setting_key,
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
                }
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
                        ],
                    }
                }
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
                        .service_url
                        .setting_key,
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
                }
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
                        ],
                    }
                }
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
                .catch(e => {
                    console.error('Error get user uid:', e);
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
                    }
                })
                .catch((e) => {
                    console.log('Error deleting user:', e);
                });
            break;

        default:
            break;
    }
    res
        .status(201)
        .send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;