const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const startAuth = require('./start-auth');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const checkAuth = await startAuth(userAbout); // 이메일 인증을 통한 프로필 설정 확인
    let responseBody; // 응답 블록 구조
    /* 각 게시물 값 저장*/
    let address,
        tel; // 교수진 소개 정보와 이름 저장

    if (checkAuth === true) { // 사용자가 프로필 설정이 되어있다면
        [address, tel] = await getData('officeInfo'); // DB로부터 해당 게시물의 데이터 get

        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: `학과 사무실 주소: ${address}
                            학과 사무실 연락처: ${tel}`
                        }
                    }
                ]
            }
        };
    } else {
        responseBody = checkAuth; // 프로필 설정이 안되었다면 누락 설정 블록으로
    }

    async function getData(params) { // 게시판 DB 검색 쿼리문 처리 함수
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
        .send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;