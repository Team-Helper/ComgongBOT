const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams; // 사용자 입력 데이터
    // console.log(userRequest);
    const studentID = userRequest.studentID_modify['origin']; // 입력한 학번 값
    // console.log(studentID);
    let responseBody; // 응답 블록 구조
    /* 바로가기 그룹, 본문, 버튼명 그리고 본문 작성*/
    const quickReplies = [];
    const items = ['나의 학번을 변경할게'];
    const label = ['↩ 뒤로가기'];
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
    /*사용자 프로필 DB 조회*/
    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    const userData = await userSelect.get();

    if (userData.data().studentID === studentID) { // 입력한 학번 값이 기존의 학번 값과 같은 경우
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "🚫 같은 학번 이예요!" // 텍스트 뷰 응답 블록으로 출력
                        }
                    }
                ],
                quickReplies: quickReplies // 바로가기 출력
            }
        }
    } else { // 아닌 경우 학번 값 수정과 응답 블록 출력
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
        .send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;