const admin = require('firebase-admin');
const functions = require('firebase-functions');

async function checkAuth(req) {
    // console.log(req);
    let responseBody;

    if (req.isFriend == undefined) {
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "🔕 컴공봇 채널 추가부터 하셔야 이용이 가능해요!" // 채널 추가 유/무 알림 텍스트
                        }
                    }
                ]
            }
        };
    } else {
        const firestore = admin.firestore();
        const testSelect = firestore
            .collection('users')
            .doc(req.plusfriendUserKey);
        const testData = await testSelect.get();
        // console.log(testData.data());

        if (!testData.exists) {
            console.log('No such user!');
            const title = ["이메일", "학년/학번", "학점"];
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
                                "title": "컴공봇 이용을 위해 이메일 인증과 학년/학번 그리고 학점 입력은 필수 입니다."
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
        } else {
            console.log('user data:', testData.data());
            return true;
        }
    }
    return responseBody; // 작성된 누락 설정 블록 리턴
}

module.exports = checkAuth;