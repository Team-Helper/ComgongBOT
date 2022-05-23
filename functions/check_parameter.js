const functions = require('firebase-functions');

exports.checkParameter = functions // 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        console.log(req.body);
        const isNumber = parseInt(req.body.utterance);
        console.log(isNumber);
        if (!isNaN(isNumber)) {
            res
                .status(200)
                .send({"status": "SUCCESS", "message": "GJ!"});
        } else {
            res
                .status(400)
                .send({"status": "FAIL", "message": "FUCK!"});
        }
    });