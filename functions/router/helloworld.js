const admin = require('firebase-admin');
const functions = require('firebase-functions');

async function checkAuth(req) {
    // console.log(req);
    const result = await admin
        .auth()
        .getUserByEmail('test@test.com') // 생성된 메일 주소 대조
        .then(async (userRecord) => {
            console.log(userRecord);
            return true; // 있을 경우 true 값을 리턴
        })
        .catch(async (error) => { // 없을 경우 누락 설정 블록 작성
            // console.log('Error fetching user data:', error);
            // await admin
            //     .auth()
            //     .createUser({email: 'test@test.com'}); // 테스트 유저 등록

            const title = ["이메일", "학년/학번", "학점"];
            const description = "❌ 미설정";
            const itemList = [];

            title.forEach(value => {
                itemList.push({"title": value, "description": description});
            });
            const responseBody = {
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
                            "blockId": functions.config().service_url.email_key,
                            "label": "이메일 인증"
                        }
                    ]
                }
            };
            return responseBody; // 작성된 누락 설정 블록 리턴
        });
    return result;
}

module.exports = checkAuth;