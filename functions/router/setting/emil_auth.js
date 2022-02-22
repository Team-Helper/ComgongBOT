const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', function (req, res) {
    const userRequest = req.body.userRequest;
    console.log(userRequest);
    // await admin.auth().createUser({
    //     email : 'test@test.com'
    // });
    // await admin
    //         .auth()
    //         .getUserByEmail('test@test.com') // 생성된 메일 주소 대조
    //         .then(async (userRecord) => {
    //             console.log('user Info: ', userRecord);
    //             return true; // 있을 경우 true 값을 리턴
    //         })
    //         .catch(async (error) => { // 없을 경우 누락 설정 블록 작성
    //             console.log('Error fetching user data:', error);
    //         });
    const responseBody = {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: userRequest.utterance
                    }
                }
            ],
        }
    };
    res
        .status(201)
        .send(responseBody);
});

module.exports = router;