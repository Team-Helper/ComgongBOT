const functions = require('firebase-functions');

exports.checkNumber = functions
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        /* 사용자가 입력한 학점 값이 숫자형 타입인지를 검증 */
        console.log(req.body.utterance);
        if (req.body.utterance === "입력 취소") {
            console.log('hello?');
            res.send({"status": "IGNORE"});
        } else {
            const isNumber = parseInt(req.body.utterance);
            console.log(isNumber, typeof isNumber);
            if (!isNaN(isNumber)) {
                res
                    .status(200)
                    .send({"status": "SUCCESS"});
            } else {
                res
                    .status(400)
                    .send({"status": "FAIL"});
            }
        }
    });