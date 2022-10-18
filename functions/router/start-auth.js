const admin = require('firebase-admin');
const AES = require('crypto-js/aes');
const functions = require('firebase-functions');

async function checkAuth(req) {
    // console.log(req);
    let responseBody;

    /* 사용자의 카카오 채널 추가 상태를 획인해 사용자 인증 검증 진행 혹은 경고문 출력 */
    if (req.isFriend === undefined) {
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "🔕 컴공봇 채널 추가부터 하셔야 이용이 가능해요!"
                        }
                    }
                ]
            }
        };
    } else {
        /* 인증된 사용자의 프로필 DB 조회*/
        const firestore = admin.firestore();
        const userSelect = firestore
            .collection('users')
            .doc(req.plusfriendUserKey);
        const userData = await userSelect.get();

        /* 채널은 추가 했으나 프로필 DB가 없는 경우엔 관련 경고문 출력 */
        if (!userData.exists) {
            console.log('No such user!');
            const title = ["이메일", "학번"];
            const description = "❌ 미설정";
            const itemList = [];
            /* 사용자 카카오채널 id값을 암호화 */
            const userKey = req.plusfriendUserKey;
            const encrypted = AES
                .encrypt(
                    JSON.stringify(userKey),
                    functions.config().service_key.aes
                )
                .toString();
            // console.log(encrypted);
            /* 암호화 값을 파라미터에 포함해 이메일 인증 입력 페이지로 이동 */
            const url = 'https://comgong-bot.web.app/email-auth?variable=';
            const newURL = new URL(url);
            newURL
                .searchParams
                .set('variable', encrypted);
            const webLink = newURL.href; 
            // console.log(webLink);

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
                                "title": "컴공봇 이용을 위해 이메일 인증과 학번 입력은 필수 입니다.",
                                "buttons": [
                                    {
                                        "label": "이메일 인증",
                                        "action": "webLink",
                                        "webLinkUrl": webLink
                                    }
                                ]
                            }
                        }
                    ]
                }
            };
        } else { // 인증, 프로필 DB까지 조회된 사용자인 경우엔 true 값으로 리턴하여 관련 서비스 이용을 허용
            // console.log('user data:', userData.data());
            return true;
        }
    }
    return responseBody;
}

module.exports = checkAuth;