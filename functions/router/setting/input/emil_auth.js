const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams; // 사용자 입력 데이터
    const email = userRequest.email['origin']; // 입력한 이메일
    const grade = userRequest.grade['origin']; // 입력한 학년
    const studentID = userRequest.studentID['origin']; // 입력한 학번
    // console.log(email, grade, studentID);

    await admin
        .auth()
        .createUser({email: email}) // 입력한 이메일 주소로 AUTH 생성
        .catch(e => {
            console.error('Error from auth to createUser:', e);
        });

    const firestore = admin.firestore();
    const docRef = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey); // 사용자 카카오채널 id 값으로 프로필 DB 생성
    await docRef
        .set(
            {email: email, grade: grade, studentID: studentID, status: true} // 프로필 DB에 기본 데이터 생성 (재학상태는 기본적으르 '재학')
        )
        .then(() => {
            const responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleText: {
                                text: "✅프로필 생성이 완료되었습니다.✅\n하단의 버튼을 통해 본인의 학점도 바로 입력해보세요." // 텍스트 뷰 응답 블록으로 출력
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            // 바로가기 작성 및 출력
                            "messageText": "학점 입력할게",
                            "action": "block",
                            "blockId": functions
                                .config()
                                .service_url
                                .credit_key,
                            "label": "학점 입력"
                        }
                    ]
                }
            };
            res
                .status(201)
                .send(responseBody); // 응답 상태 코드와 내용 전송
        })
        .catch(e => {
            console.error('Error from set profile DB:', e);
            res.sendStatus(e.response.status); // 에러 코드 전송
        });
});

module.exports = router;