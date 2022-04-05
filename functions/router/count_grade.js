const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.countGrade = functions // 함수 이름
    .region('asia-northeast1')
    .pubsub
    .schedule('0 0 1 3 *') // 매년 3월 1일에 작동
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        const firestore = admin.firestore();
        const snapshot = await firestore
            .collection('users')
            .get();
        await snapshot
            .docs
            .map(async (doc) => {
                /*사용자들의 학년과 재학상태 변수 처리*/
                const grade = doc
                    .data()
                    .grade;
                const status = doc
                    .data()
                    .status;
                if (status === true) {
                    if (grade < 4) { // 재학 상태이며 학년 값이 4학년을 넘지 않는 경우
                        const upGrade = parseInt(grade) + 1;
                        const userSelect = firestore
                            .collection('users')
                            .doc(doc.id);
                        await userSelect.update({grade: `${upGrade}`}); // 학년 값 증가 및 DB에 업데이트
                    }
                }
            });
        return null;
    });