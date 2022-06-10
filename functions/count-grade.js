const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.countGrade = functions // 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        // console.log(req.body.admin);
        if (req.body.admin === functions.config().service_key.admin) { // 모듈 실행에 앞서 특정 key 값이 있는 요청인 경우
            const firestore = admin.firestore();
            const snapshot = await firestore
                .collection('users')
                .get();
            await snapshot
                .docs
                .map(async (doc) => {
                    /* 모든 사용자들의 학년과 재학상태 변수 처리*/
                    const grade = doc
                        .data()
                        .grade;
                    const status = doc
                        .data()
                        .status;
                    if (status === true) {
                        if (grade < 4) { // 재학 상태이며 학년 값이 4학년을 넘지 않는 경우
                            const upGrade = grade + 1;
                            const userSelect = firestore
                                .collection('users')
                                .doc(doc.id);
                            await userSelect.update({
                                grade: Number(`${upGrade}`)
                            }); // 학년 값 증가 및 DB에 업데이트
                        }
                    }
                });
            res.sendStatus(200);
        } else { // 특정 key 값이 없는 요청인 경우
            console.error('No have key');
            res.sendStatus(400);
        }
    });