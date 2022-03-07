const functions = require('firebase-functions');
const axios = require('axios');

exports.coldBreak = functions
    .region('asia-northeast1')
    .pubsub
    .schedule('*/5 * * * *')
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        // const userRequest = {
        //     user: {
        //         "properties": {
        //             "plusfriendUserKey": "ByCRcJlK1TSyZAIP5Gjk",
        //             "isFriend": true
        //         }
        //     }
        // };
        await axios
            .post(
                'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/public'
            )
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error('Error from coldBreak : ', error);
            });
        await axios
            .post(
                'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/private'
            )
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error('Error from coldBreak : ', error);
            });
        await axios
            .post(
                'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/personal'
            )
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error('Error from coldBreak : ', error);
            });
        await axios
            .post(
                'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/setting'
            )
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error('Error from coldBreak : ', error);
            });
        return null;
    });