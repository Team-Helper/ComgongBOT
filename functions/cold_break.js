const functions = require('firebase-functions');
const axios = require('axios');

exports.coldBreak = functions // 함수 이름
    .region('asia-northeast1')
    .pubsub
    .schedule('*/5 * * * *') // 5분 단위로 작동
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        let publicData = JSON.stringify({ // 학과 공용 서비스 조회 관련 데이터 시나리오
            "userRequest": {
                "user": {
                    "properties": {
                        "plusfriendUserKey": "testID",
                        "isFriend": true
                    }
                }
            }
        });
        let publicConfig = {
            method: 'post',
            url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/public',
            headers: {
                'Content-Type': 'application/json'
            },
            data: publicData
        };
        await axios(publicConfig)
            .then(async (result) => {
                /* 서비스 조회 성공 시 바로가기 조회 시나리오 작성 및 실행*/
                console.log('public: ', result.status);
                publicData = JSON.stringify({
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
                publicConfig = {
                    method: 'post',
                    url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/public',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: publicData
                };
                await axios(publicConfig)
                    .then(result => {
                        console.log('public service: ', result.status); // 조회 성공 시 성공 상태 코드 출력
                    })
                    .catch(err => {
                        console.error('Error from coldBreak public service: ', err); // 실패 시 에러문 출력
                    });
            })
            .catch(err => {
                console.error('Error from coldBreak public: ', err);
            });

        let personalData = JSON.stringify({
            "userRequest": {
                "user": {
                    "properties": {
                        "plusfriendUserKey": "testID",
                        "isFriend": true
                    }
                }
            }
        });
        let personalConfig = {
            method: 'post',
            url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/personal',
            headers: {
                'Content-Type': 'application/json'
            },
            data: personalData
        };
        await axios(personalConfig)
            .then(async (result) => {
                console.log('personal: ', result.status);
                personalData = JSON.stringify({
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
                personalConfig = {
                    method: 'post',
                    url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/personal/per' +
                            'sonal_service',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: personalData
                };
                await axios(personalConfig)
                    .then(result => {
                        console.log('personal service: ', result.status);
                    })
                    .catch(err => {
                        console.error('Error from coldBreak personal service: ', err);
                    });
            })
            .catch(err => {
                console.error('Error from coldBreak personal: ', err);
            });

        let settingData = JSON.stringify({
            "userRequest": {
                "user": {
                    "properties": {
                        "plusfriendUserKey": "testID",
                        "isFriend": true
                    }
                }
            }
        });
        let settingConfig = {
            method: 'post',
            url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/setting',
            headers: {
                'Content-Type': 'application/json'
            },
            data: settingData
        };
        await axios(settingConfig)
            .then(async (result) => {
                console.log('setting: ', result.status);
                settingData = JSON.stringify({
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
                settingConfig = {
                    method: 'post',
                    url: 'https://asia-northeast1-comgong-bot.cloudfunctions.net/middleWare/setting/sett' +
                            'ing_service',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: settingData
                };
                await axios(settingConfig)
                    .then(result => {
                        console.log('setting service: ', result.status);
                    })
                    .catch(err => {
                        console.error('Error from coldBreak setting service: ', err);
                    });
            })
            .catch(err => {
                console.error('Error from coldBreak setting: ', err);
            });
        return null;
    });