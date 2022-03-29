const functions = require('firebase-functions');
const axios = require('axios');

exports.coldBreak = functions // 함수 이름
    .region('asia-northeast1')
    .pubsub
    .schedule('*/5 * * * *') // 5분 단위로 작동
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        let data = JSON.stringify({
            "userRequest": {
                "user": {
                    "properties": {
                        "plusfriendUserKey": "testID",
                        "isFriend": true
                    }
                }
            }
        });
        let config = {
            method: 'post',
            url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/public',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        await axios(config)
            .then(async (result) => {
                console.log('public: ', result.status);
                data = JSON.stringify({
                    "userRequest": {
                        "user": {
                            "properties": {
                                "plusfriendUserKey": "testID",
                                "isFriend": true
                            },
                            "utterance": "공지사항 게시판을 조회해줘"
                        }
                    }
                });
                config = {
                    method: 'post',
                    url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/public',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                await axios(config)
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

        let data2 = JSON.stringify({
            "userRequest": {
                "user": {
                    "properties": {
                        "plusfriendUserKey": "testID",
                        "isFriend": true
                    }
                }
            }
        });
        let config2 = {
            method: 'post',
            url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/personal',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        await axios(config2)
            .then(async (result) => {
                console.log('personal: ', result.status);
                data2 = JSON.stringify({
                    "userRequest": {
                        "user": {
                            "properties": {
                                "plusfriendUserKey": "testID",
                                "isFriend": true
                            }
                        },
                        "utterance": "나의 누적 학점을 알려줘"
                    }
                });
                config2 = {
                    method: 'post',
                    url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/personal/per' +
                            'sonal_service',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data2
                };
                await axios(config2)
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

        let data3 = JSON.stringify({
            "userRequest": {
                "user": {
                    "properties": {
                        "plusfriendUserKey": "testID",
                        "isFriend": true
                    }
                }
            }
        });
        let config3 = {
            method: 'post',
            url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/setting',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data3
        };
        await axios(config3)
            .then(async (result) => {
                console.log('setting: ', result.status);
                data3 = JSON.stringify({
                    "userRequest": {
                        "user": {
                            "properties": {
                                "plusfriendUserKey": "testID",
                                "isFriend": true
                            }
                        },
                        "utterance": "설정을 초기화 해줘"
                    }
                });
                config3 = {
                    method: 'post',
                    url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/setting/sett' +
                            'ing_service',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data3
                };
                await axios(config3)
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