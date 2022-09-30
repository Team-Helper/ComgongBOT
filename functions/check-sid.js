const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.checkStudentID = functions // 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        // console.log(req.body);
        /* 사용자의 입력 값이 숫자형 타입이며 최소(학번 DB 첫번째 값), 최대(올해 년도) 학번 값을 준수한 입력인지를 검증 */
        const thisYear = new Date()
            .getFullYear()
            .toString()
            .substring(2);
        // console.log(thisYear, typeof thisYear);
        const studentID = parseInt(req.body.utterance);
        // console.log(studentID, typeof studentID);

        let firestore = admin.firestore();
        const creditIDs = await firestore
            .collection('engineeringCredits')
            .get();

        const firstCreditId = parseInt(creditIDs.docs[0].id.substring(2));
        // console.log(firstCreditId, typeof firstCreditId);

        if (!isNaN(studentID) && (studentID >= firstCreditId && studentID <= parseInt(thisYear))) {
            res
                .status(200)
                .send({"status": "SUCCESS"});
        } else {
            res
                .status(400)
                .send({"status": "FAIL"});
        }
    });