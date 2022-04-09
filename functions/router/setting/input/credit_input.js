const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams; // 사용자 입력 데이터
    // console.log(userRequest);
    const majorA = userRequest.majorA.value; // 입력한 전공필수
    const majorB = userRequest.majorB.value; // 입력한 전공선택
    const geA = userRequest.geA.value; // 입력한 교양필수
    const geB = userRequest.geB.value; // 입력한 교양선택
    const total = userRequest.total.value; // 입력한 총 학점
    // console.log(majorA, majorB, geA, geB, total);
    /*사용자 프로플 DB 조회*/
    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);

    await userSelect
        .update({
            'credits': { // 사용자 프로필 DB에 학점 관련 key와 Values로 데이터 MAP 생성
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
                                text: "✅학점 입력이 완료되었습니다!\n이제 학과 개인 서비스도 이용하실 수 있게 되었습니다." // 텍스트 뷰 응답 블록으로 출력
                            }
                        }
                    ]
                }
            };
            res
                .status(201)
                .send(responseBody); // 응답 상태 코드와 내용 전송
        })
        .catch(e => {
            console.error('Error from set credit into DB:', e);
            res.sendStatus(e.response.status); // 에러 코드 전송
        });
});

module.exports = router;