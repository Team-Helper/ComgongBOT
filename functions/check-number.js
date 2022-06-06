const functions = require('firebase-functions');

exports.checkNumber = functions // 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        const isNumber = parseInt(req.body.utterance); // 사용자가 입력한 학점 값
        // console.log(isNumber);
        if (!isNaN(isNumber)) { // 숫자 타입인 경우
            res
                .status(200)
                .send({"status": "SUCCESS", "message": "this is a number"}); // 성공 전송
        } else { // 아닌 경우
            res
                .status(400)
                .send({"status": "FAIL", "message": "this is not a number!"}); // 실패 전송
        }
    });