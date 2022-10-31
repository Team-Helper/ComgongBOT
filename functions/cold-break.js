const functions = require('firebase-functions');
const axios = require('axios');

exports.coldBreak = functions
    .region('asia-northeast1')
    .pubsub
    .schedule('*/3 * * * *')
    .timeZone('Asia/Seoul')
    .onRun(() => {
        function publicCold() {
            /* 카카오 채널 친구 추가 상태와 테스트 단위 사용자 명시 */
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

        function personalCold() {
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

        function settingCold() {
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

        function officeInfoCold() {
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
                url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/officeInfo',
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
                    console.log(error);
                });

        }

        /* 순차적으로 3분 단위로 각 서비스 함수 호출 */
        axios
            .all([
                publicCold(),
                personalCold(),
                settingCold(),
                officeInfoCold()
            ])
            .then(axios.spread(() => {
                console.log('Break!');
            }));
        return null;
    });