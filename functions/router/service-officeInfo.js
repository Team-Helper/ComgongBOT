const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    /* 사용자의 카카오 채널 추가 상태 여부를 통해 사용자가 요청한 학과 사무실 안내 데이터 혹은 경고문 출력 */
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    let responseBody;
    let address,
        tel;

    if (userAbout.isFriend === true) {
        [address, tel] = await getData('officeInfo');
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: `학과 사무실은 [${address}]에 있으며 연락처는 ${tel} 입니다.`
                        }
                    }
                ]
            }
        };
    } else {
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
    }

    /* 학과 사무실 안내 DB 조회 */
    async function getData(params) {
        let address = '';
        let tel = '';

        await admin
            .database()
            .ref(params)
            .once('value')
            .then(snapshot => {
                address = snapshot
                    .val()
                    .address;
                tel = snapshot
                    .val()
                    .tel;
            })
            .catch(err => {
                console.error('Error from officeInfo_service getData :', err);
            });
        // console.log(address);
        return [address, tel];
    }

    res
        .status(201)
        .send(responseBody);
});

module.exports = router;