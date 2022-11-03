const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    /* 사용자 프로필 DB 조회*/
    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    const userData = await userSelect.get();
    /* 사용자 입력 값을 조회 시 0 인 경우 적재된 기존의 학점 값으로 작성 */
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams;
    // console.log(userRequest);
    const majorMust = parseInt(userRequest.majorMust.origin) == 0
        ? userData
            .data()
            .credits
            .majorMust
        : parseInt(userRequest.majorMust.origin);
    const majorChoice = parseInt(userRequest.majorChoice.origin) == 0
        ? userData
            .data()
            .credits
            .majorChoice
        : parseInt(userRequest.majorChoice.origin);
    const electiveMust = parseInt(userRequest.electiveMust.origin) == 0
        ? userData
            .data()
            .credits
            .electiveMust
        : parseInt(userRequest.electiveMust.origin);
    const electiveChoice = parseInt(userRequest.electiveChoice.origin) == 0
        ? userData
            .data()
            .credits
            .electiveChoice
        : parseInt(userRequest.electiveChoice.origin);
    const total = parseInt(userRequest.total.origin) == 0
        ? userData
            .data()
            .credits
            .total
        : parseInt(userRequest.total.origin);
    // console.log(majorMust, majorChoice, electiveMust, electiveChoice, total);

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
                                text: "🔄 입력하신 전체 교과목 학점으로 수정이 완료되었습니다."
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
            console.error('Error from credits modify:', err);
            res.sendStatus(err.response.status);
        });
});

module.exports = router;