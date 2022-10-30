const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams;
    // console.log(userRequest);
    const majorMust = (userRequest.majorMust.value);
    const majorChoice = (userRequest.majorChoice.value);
    const electiveMust = (userRequest.electiveMust.value);
    const electiveChoice = (userRequest.electiveChoice.value);
    const total = (userRequest.total.value);
    // console.log(majorMust, majorChoice, electiveMust, electiveChoice, total);
    /* 사용자 프로필 DB 조회*/
    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);

    /* 사용자 프로필 DB에 입력된 학점 값을 학점 이름의 MAP으로 생성 */
    await userSelect
        .update({
            'credits': {
                'majorMust': majorMust,
                'majorChoice': majorChoice,
                'electiveMust': electiveMust,
                'electiveChoice': electiveChoice,
                'total': total
            }
        })
        .then(() => {
            const responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "✅ 학점 입력이 완료되었습니다!\n이제 학과 개인 서비스도 이용하실 수 있습니다."
                            }
                        }
                    ]
                }
            };
            res
                .status(201)
                .send(responseBody);
        })
        .catch(err => {
            console.error('Error from set credit into DB:', err);
            res.sendStatus(err.response.status);
        });
});

module.exports = router;