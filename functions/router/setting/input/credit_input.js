const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams;
    // console.log(userRequest);
    const majorA = JSON.parse(userRequest.majorA.value);
    const majorB = JSON.parse(userRequest.majorB.value);
    const geA = JSON.parse(userRequest.geA.value);
    const geB = JSON.parse(userRequest.geB.value);
    const total = JSON.parse(userRequest.total.value);
    // console.log(majorA.amount, majorB.amount, geA.amount, geB.amount, total.amount);

    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);

    await userSelect
        .update({
            'credits': {
                'majorA': majorA.amount,
                'majorB': majorB.amount,
                'geA': geA.amount,
                'geB': geB.amount,
                'total': total.amount
            }
        })
        .then(() => {
            const responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "학점 입력이 완료되었습니다! 이제 학과 개인 서비스도 이용하실 수 있게 되었습니다."
                            }
                        }
                    ]
                }
            };
            res
                .status(201)
                .send(responseBody);
        })
        .catch(e => {
            console.error('Error from set credit into DB:', e);
        });
});

module.exports = router;