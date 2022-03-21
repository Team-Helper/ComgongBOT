const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams; // 사용자 입력 데이터
    // console.log(userRequest);
    const majorA = userRequest.majorA.value; // 전공필수
    const majorB = userRequest.majorB.value; // 전공선택
    const geA = userRequest.geA.value; // 교양필수
    const geB = userRequest.geB.value; // 교양선택
    const total = userRequest.total.value; // 총 학점
    // console.log(majorA, majorB, geA, geB, total);
    const firestore = admin.firestore();
    const userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
        
    await userSelect
        .update({
            'credits': { // 사용자 프로필 DB에 'credits' 라는 KEY 값의 학점 데이터 MAP 생성
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
                .send(responseBody); // 응답 전송
        })
        .catch(e => {
            console.error('Error from set credit into DB:', e);
        });
});

module.exports = router;