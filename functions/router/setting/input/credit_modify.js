const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams; // 사용자 입력 데이터
    // console.log(userRequest);
    const menuType = userRequest.menu.value; // 교과목
    const credit = userRequest.credit.value; // 학점 값
    let responseBody;
    let quickReplies = [];
    let items;
    let label;
    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    const userData = await userSelect.get();
    // console.log(userData.data().credits[menuType]);

    if (userData.data().credits[menuType] === credit) { // 입력한 학점이 기존의 학점 값과 같을 경우
        items = ['나의 학점을 수정할게'];
        label = ['🔙 뒤로가기'];
        items.forEach((value, index) => {
            quickReplies.push({
                "messageText": value,
                "action": "block",
                "blockId": functions
                    .config()
                    .service_url
                    .credit_modify_key,
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
        }
    } else { // 아닌 경우 사용자의 학점 데이터를 변경 및 알림
        await userSelect.update({
            [`credits.${menuType}`]: `${credit}`
        });
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
        }
    }

    res
        .status(201)
        .send(responseBody);
});

module.exports = router;