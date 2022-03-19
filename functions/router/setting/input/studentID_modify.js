const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams;
    // console.log(userRequest);
    const studentID = userRequest.studentID_modify['origin'];
    // console.log(studentID);

    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    const userData = await userSelect.get();
    
    const quickReplies = [];
    const items = ['나의 학번을 변경할게'];
    const label = ['🔙 뒤로가기'];
    items.forEach((value, index) => {
        quickReplies.push({
            "messageText": value,
            "action": "block",
            "blockId": functions
                .config()
                .service_url
                .studentid_modify_key,
            "label": label[index]
        });
    });
    let responseBody;

    if (userData.data().studentID === studentID) {
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "🚫 같은 학번 이예요!"
                        }
                    }
                ],
                quickReplies: quickReplies
            }
        }
    } else {
        await userSelect
            .update({studentID: `${studentID}`})
            .then(() => {
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "🔄 입력하신 학번으로 변경이 완료되었습니다."
                                }
                            }
                        ]
                    }
                };
            })
            .catch(e => {
                console.error('Error studentID modify:', e);
            });
    }

    res
        .status(201)
        .send(responseBody);
});

module.exports = router;