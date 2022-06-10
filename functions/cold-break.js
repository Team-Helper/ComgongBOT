const functions = require('firebase-functions');
const axios = require('axios');

exports.coldBreak = functions // 함수 이름
    .region('asia-northeast1')
    .pubsub
    .schedule('*/3 * * * *') // 3분 단위로 작동
    .timeZone('Asia/Seoul')
    .onRun(() => {
        function publicCold() { // 학과 공용 서비스 coldBreak
            const data = JSON.stringify({
                "userRequest": {
                    "user": {
                        "properties": {
                            "plusfriendUserKey": functions
                                .config()
                                .service_key
                                .testID,
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

            return axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.error(error);
                });
        }

        function privateCold() { // 학과 전용 서비스 coldBreak
            const data = JSON.stringify({
                "userRequest": {
                    "user": {
                        "properties": {
                            "plusfriendUserKey": functions
                                .config()
                                .service_key
                                .testID,
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

            return axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.error(error);
                });

        }

        function personalCold() { // 학과 개인 서비스 coldBreak
            const data = JSON.stringify({
                "userRequest": {
                    "user": {
                        "properties": {
                            "plusfriendUserKey": functions
                                .config()
                                .service_key
                                .testID,
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

            return axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.error(error);
                });
        }

        function settingCold() { // 설정 coldBreak
            const data = JSON.stringify({
                "userRequest": {
                    "user": {
                        "properties": {
                            "plusfriendUserKey": functions
                                .config()
                                .service_key
                                .testID,
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

            return axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.error(error);
                });

        }

        axios
            .all([publicCold(), privateCold(), personalCold(), settingCold()]) // 순차적으로 함수 실행
            .then(axios.spread(() => {
                console.log('Break!');
            }));
        return null;
    });