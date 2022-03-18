const functions = require('firebase-functions');
const axios = require('axios');

exports.coldBreak = functions
    .region('asia-northeast1')
    .pubsub
    .schedule('*/5 * * * *')
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        let userRequest = {
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
            .then(async (result) => {
                console.log('public: ', result.status);
                userRequest = {
                    utterance: "공지사항 게시판을 조회해줘"
                };
                await axios
                    .post(
                        'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/public/publi' +
                                'c_service',
                        {userRequest}
                    )
                    .then(result => {
                        console.log('public service: ', result.status);
                    })
                    .catch(error => {
                        console.error('Error from coldBreak public service: ', error);
                    });
            })
            .catch(error => {
                console.error('Error from coldBreak public: ', error);
            });

        // await axios
        //     .post(
        //         'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/private',
        //         {userRequest}
        //     )
        //     .then(result => {
        //         console.log(result.status);
        //     })
        //     .catch(error => {
        //         console.error('Error from coldBreak : ', error);
        //     });

        await axios
            .post(
                'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/personal',
                {userRequest}
            )
            .then(async (result) => {
                console.log('personal: ', result.status);
                userRequest = {
                    utterance: "나의 누적 학점을 알려줘"
                };
                await axios
                    .post(
                        'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/personal/per' +
                                'sonal_service',
                        {userRequest}
                    )
                    .then(result => {
                        console.log('personal service: ', result.status);
                    })
                    .catch(error => {
                        console.error('Error from coldBreak personal service: ', error);
                    });
            })
            .catch(error => {
                console.error('Error from coldBreak personal: ', error);
            });

        await axios
            .post(
                'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/setting',
                {userRequest}
            )
            .then(async (result) => {
                console.log('setting: ', result.status);
                userRequest = {
                    utterance: "설정을 초기화 해줘"
                };
                await axios
                    .post(
                        'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/setting/sett' +
                                'ing_service',
                        {userRequest}
                    )
                    .then(result => {
                        console.log('setting service: ', result.status);
                    })
                    .catch(error => {
                        console.error('Error from coldBreak setting service: ', error);
                    });
            })
            .catch(error => {
                console.error('Error from coldBreak setting: ', error);
            });
        return null;
    });