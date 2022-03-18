const functions = require('firebase-functions');
const axios = require('axios');

exports.coldBreak = functions
    .region('asia-northeast1')
    .pubsub
    .schedule('*/5 * * * *')
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "testID",
                    "isFriend": true
                }
            }
        };
        await axios
            .post(
                'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/public',
                {userRequest}
            )
            .then(result => {
                console.log(result.status);
            })
            .catch(error => {
                console.error('Error from coldBreak : ', error);
            });
        await axios
            .post(
                'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/private',
                {userRequest}
            )
            .then(result => {
                console.log(result.status);
            })
            .catch(error => {
                console.error('Error from coldBreak : ', error);
            });
        await axios
            .post(
                'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/personal',
                {userRequest}
            )
            .then(result => {
                console.log(result.status);
            })
            .catch(error => {
                console.error('Error from coldBreak : ', error);
            });
        await axios
            .post(
                'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/setting',
                {userRequest}
            )
            .then(result => {
                console.log(result.status);
            })
            .catch(error => {
                console.error('Error from coldBreak : ', error);
            });
        return null;
    });