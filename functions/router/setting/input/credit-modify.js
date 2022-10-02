const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams;
    // console.log(userRequest);
    const menuType = userRequest.menu.value;
    const credit = parseInt(userRequest.credit.value);
    // console.log(credit, typeof credit);
    let responseBody;
    let quickReplies = [];
    let items;
    let label;
    /* 사용자 프로필 DB 조회*/
    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    const userData = await userSelect.get();
    const userCredit = parseInt(userData.data().credits[menuType]);
    // console.log(userCredit, typeof userCredit);

    /* 사용자의 기존 학점 값과 요청 값인 수정 학점 값의 중복 여부를 검증해 관련 응답 블록 출력과 수정 실행 */
    if (userCredit === credit) {
        /* 바로가기 작성*/
        items = ['나의 학점을 수정할게'];
        label = ['↩ 뒤로가기'];
        items.forEach((value, index) => {
            quickReplies.push({
                "messageText": value,
                "action": "block",
                "blockId": functions
                    .config()
                    .service_key
                    .credit_modify,
                "label": label[index]
            });
        });
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "🚫 이미 같은 학점 이예요!"
                        }
                    }
                ],
                quickReplies: quickReplies
            }
        };
    } else {
        await userSelect
            .update({
                [`credits.${menuType}`]: Number(`${credit}`)
            })
            .then(() => {
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "🔄 입력하신 학점으로 수정이 완료되었습니다."
                                }
                            }
                        ]
                    }
                };
            })
            .catch(err => {
                console.error('Error credit modify:', err);
            });
    }
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;