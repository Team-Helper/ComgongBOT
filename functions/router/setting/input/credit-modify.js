const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams; // 사용자 입력 데이터
    // console.log(userRequest);
    const menuType = userRequest.menu.value; // 입력한 교과목
    const credit = Number(userRequest.credit.value); // 입력한 학점 값
    // console.log(credit, typeof credit);
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
    const userCredit = Number(userData.data().credits[menuType]); // 사용자 현재 학점 값
    // console.log(userCredit, typeof userCredit);

    if (userCredit === credit) { // 입력한 학점이 기존의 학점 값과 같을 경우
        /* 바로가기 작성*/
        items = ['나의 학점을 수정할게'];
        label = ['↩ 뒤로가기'];
        items.forEach((value, index) => {
            quickReplies.push({
                "messageText": value,
                "action": "block",
                "blockId": functions
                    .config()
                    .service_key
                    .credit_modify,
                "label": label[index]
            });
        });
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: "🚫 이미 같은 학점 이예요!" // 텍스트 뷰 응답 블록으로 출력
                        }
                    }
                ],
                quickReplies: quickReplies // 바로가기 출력
            }
        };
    } else { // 아닌 경우 사용자의 학점 데이터를 변경 및 응답 블록 출력
        await userSelect
            .update({
                [`credits.${menuType}`]: Number(`${credit}`)
            })
            .then(() => {
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "🔄 입력하신 학점으로 수정이 완료되었습니다." // 텍스트 뷰 응답 블록으로 출력
                                }
                            }
                        ]
                    }
                };
            })
            .catch(err => {
                console.error('Error credit modify:', err);
            });
    }
    res
        .status(201)
        .send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;