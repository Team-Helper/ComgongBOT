const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams; // 사용자 입력 데이터
    // console.log(userRequest);
    const studentID = parseInt(userRequest.studentID.value); // 입력한 학번 값
    // console.log(studentID);
    let responseBody; // 응답 블록 구조
    let quickReplies = []; // 바로가기 그룹
    let items; // 바로가기 본문
    let label; // 바로가기 버튼명
    /* 사용자 프로필 DB 조회*/
    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    const userData = await userSelect.get();
    const userStudentID = parseInt(userData.data().studentID);

    if (userStudentID === studentID) { // 입력한 학번 값이 기존의 학번 값과 같은 경우
        /* 바로가기 작성*/
        items = ['나의 학번을 변경할게'];
        label = ['↩ 뒤로가기'];
        items.forEach((value, index) => {
            quickReplies.push({
                "messageText": value,
                "action": "block",
                "blockId": functions
                    .config()
                    .service_key
                    .studentID_modify,
                "label": label[index]
            });
        });
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "🚫 이미 같은 학번 이예요!" // 텍스트 뷰 블록 응답 블록으로 출력
                        }
                    }
                ],
                quickReplies: quickReplies // 바로가기 출력
            }
        };
    } else { // 아닌 경우 학번 값 수정과 응답 블록 출력
        await userSelect
            .update({
                studentID: Number(`${studentID}`)
            })
            .then(() => {
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "🔄 입력하신 학번으로 변경이 완료되었습니다." // 텍스트 뷰 블록 응답 블록으로 출력
                                }
                            }
                        ]
                    }
                };
            })
            .catch(err => {
                console.error('Error studentID modify:', err);
            });
    }
    res
        .status(201)
        .send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;