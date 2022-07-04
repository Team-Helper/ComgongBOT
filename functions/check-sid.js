const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.checkStudentID = functions // 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        let firestore = admin.firestore();
        // console.log(req.body);
        const thisYear = new Date() // 올해 년도 뒤 2글자 추출
            .getFullYear()
            .toString()
            .substring(2);
        // console.log(thisYear, typeof thisYear);
        const studentID = parseInt(req.body.utterance); // 사용자가 입력한 학점 값
        // console.log(studentID, typeof studentID);
        
        const creditIDs = await firestore
            .collection('engineeringCredits')
            .get();
        
        const creditID = [];
        creditIDs.forEach(doc => {
            creditID.push(doc.id);
        })
        // console.log(creditID[0].substring(2));
        if (!isNaN(studentID) && (studentID >= parseInt(creditID[0].substring(2)) && studentID <= parseInt(thisYear))) { // 숫자형 타입이며 최소, 최대 학번 값을 준수한 입력인 경우
            res
                .status(200)
                .send({"status": "SUCCESS"}); // 성공 전송
        } else { // 아닌 경우
            res
                .status(400)
                .send({"status": "FAIL"}); // 실패 전송
        }
    });