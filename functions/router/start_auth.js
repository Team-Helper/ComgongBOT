const admin = require('firebase-admin');
const functions = require('firebase-functions');

async function checkAuth(req) {
    // console.log(req);
    let responseBody;

    if (req.isFriend == undefined) { // 채널을 추가하지 않은 경우
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "🔕 컴공봇 채널 추가부터 하셔야 이용이 가능해요.!"
                        }
                    }
                ]
            }
        };
    } else {
        const firestore = admin.firestore();
        const userSelect = firestore
            .collection('users')
            .doc(req.plusfriendUserKey);
        const userData = await userSelect.get();

        if (!userData.exists) { // 채널은 추가 했으나 프로필 DB가 없는 사용자인 경우
            console.log('No such user!');
            const title = ["이메일", "학년/학번"];
            const description = "❌ 미설정";
            const itemList = [];

            title.forEach(value => {
                itemList.push({"title": value, "description": description});
            });
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            itemCard: {
                                "head": {
                                    "title": "⚠ 누락된 설정이 있습니다."
                                },
                                "itemList": itemList,
                                "title": "컴공봇 이용을 위해 이메일 인증과 학년/학번 입력은 필수 입니다."
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "이메일 인증할게",
                            "action": "block",
                            "blockId": functions
                                .config()
                                .service_url
                                .email_key,
                            "label": "이메일 인증"
                        }
                    ]
                }
            };
        } else { // 프로필 DB가 존재하는 사용자인 경우
            // console.log('user data:', userData.data());
            return true;
        }
    }
    return responseBody; // 작성된 누락 설정 관련 블록 리턴
}

module.exports = checkAuth;