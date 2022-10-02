const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams;
    // console.log(userRequest);
    const majorA = parseInt(userRequest.majorA.value);
    const majorB = parseInt(userRequest.majorB.value);
    const geA = parseInt(userRequest.geA.value);
    const geB = parseInt(userRequest.geB.value);
    const total = parseInt(userRequest.total.value);
    // console.log(majorA, majorB, geA, geB, total);
    /* 사용자 프로필 DB 조회*/
    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);

    /* 사용자 프로필 DB에 입력된 학점 값을 학점 이름의 MAP으로 생성 */
    await userSelect
        .update({
            'credits': {
                'majorA': majorA,
                'majorB': majorB,
                'geA': geA,
                'geB': geB,
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