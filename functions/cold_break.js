const functions = require('firebase-functions');
const axios = require('axios');

exports.coldBreak = functions // 함수 이름
    .region('asia-northeast1')
    .pubsub
    .schedule('*/3 * * * *') // 3분 단위로 작동
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        function publicCold() {
            const data = JSON.stringify({
                "userRequest": {
                    "user": {
                        "properties": {
                            "plusfriendUserKey": functions
                                .config()
                                .service_key
                                .myKey,
                            "isFriend": true
                        }
                    }
                }
            });

            const config = {
                method: 'post',
                url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/public',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function privateCold() {
            const axios = require('axios');
            const data = JSON.stringify({
                "userRequest": {
                    "user": {
                        "properties": {
                            "plusfriendUserKey": "testID",
                            "isFriend": true
                        }
                    }
                }
            });

            const config = {
                method: 'post',
                url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/private',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log(error);
                });

        }

        function personalCold() {
            const axios = require('axios');
            const data = JSON.stringify({
                "userRequest": {
                    "user": {
                        "properties": {
                            "plusfriendUserKey": "testID",
                            "isFriend": true
                        }
                    }
                }
            });

            const config = {
                method: 'post',
                url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/personal',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function settingCold() {
            const axios = require('axios');
            const data = JSON.stringify({
                "userRequest": {
                    "user": {
                        "properties": {
                            "plusfriendUserKey": "testID",
                            "isFriend": true
                        }
                    }
                }
            });

            const config = {
                method: 'post',
                url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/setting',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log(error);
                });

        }

        publicCold()
            .then(() => privateCold())
            .then(() => personalCold())
            .then(() => settingCold())
            .then(() => {
                console.log('GJ!');
            })
            .catch(err => {
                console.error(err);
            });
        return null;
    });