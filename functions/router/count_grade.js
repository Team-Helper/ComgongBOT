const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.countGrade = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .pubsub
    .schedule('0 0 1 1 *')
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        const firestore = admin.firestore();
        const snapshot = await firestore
            .collection('users')
            .get();
        await snapshot
            .docs
            .map(async (doc) => {
                const grade = doc
                    .data()
                    .grade;
                const status = doc
                    .data()
                    .status;
                if (status === true) {
                    if (grade < 4) {
                        const upGrade = parseInt(grade) + 1;
                        const userSelect = firestore
                            .collection('users')
                            .doc(doc.id);
                        await userSelect.update({grade: `${upGrade}`})
                    }
                }
            });
        return null;
    });