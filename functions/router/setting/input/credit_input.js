const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams;
    // console.log(userRequest);
    const majorA = userRequest.majorA.value;
    const majorB = userRequest.majorB.value;
    const geA = userRequest.geA.value;
    const geB = userRequest.geB.value;
    const total = userRequest.total.value;
    // console.log(majorA, majorB, geA, geB, total);

    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);

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