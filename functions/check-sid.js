const functions = require('firebase-functions');

exports.checkStudentID = functions // 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        // console.log(req.body);
        const thisYear = new Date() // 올해 년도 뒤 2글자 추출
            .getFullYear()
            .toString()
            .substring(2);
        // console.log(thisYear, typeof thisYear);
        const studentID = Number(req.body.utterance); // 사용자가 입력한 학점 값
        // console.log(studentID, typeof studentID);
        if (isNaN(studentID) && (studentID < Number('08') || studentID > Number(thisYear))) { // 문자열이고 지원 학번이 아닌 경우
            res
                .status(400)
                .send({"status": "FAIL"}); // 실패 전송

        } else { // 아닌 경우
            res
                .status(200)
                .send({"status": "SUCCESS"}); // 성공 전송
        }
    });