const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/setting_service', () => { // 테스트 수트
    it(
        'responds change user grade data before choose',
        done => { // 테스트 단위 : 학년 변경 전 메뉴 선택이 이루어질 떄
            const userRequest = { // 기본 사용자 정보 시나리오와 요청 발화문
                user: {
                    "properties": {
                        "plusfriendUserKey": "some-id",
                        "isFriend": true
                    }
                },
                utterance: "나의 학년을 변경할게"
            };
            request(functions.config().service_url.app) // 테스트 하려는 기본 주소
                .post('/setting/setting_service') // 주소의 엔드포인트
                .set('Accept', 'application/json')
                .type('application/json')
                .send({userRequest}) // body 데이터 전송
                .expect(201) // 응답 상태코드
                .then(res => {
                    const element = res
                        .body
                        .template
                        .outputs[0]
                        .simpleText;
                    // console.log(element);
                    expect(element.text)
                        .to
                        .include("변경하고자 하는 학년으로"); // 응답 결과가 작성한 텍스트 내용을 포함하는가

                    const elementQuick = res
                        .body
                        .template
                        .quickReplies[0];
                    const array = ['1', '2', '3', '4', '뒤로가기'];
                    for (let index = 0; index < elementQuick.length; index++) {
                        expect(element[index].label)
                            .to
                            .include(array[index]); // 응답 블록의 바로가기 버튼명이 지정한 배열의 내용을 포함하는가
                    }
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
            }
    );
    it('responds change user grade data', done => { // 학년 변경이 성공했을 때
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "1학년"
        };
        request(functions.config().service_url.app)
            .post('/setting/setting_service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                // console.log(element);
                expect(element.text)
                    .to
                    .include("선택하신 학년으로");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
        });
    it('responds change user grade data fail', done => { // 중복 문제로 학년 변경이 실패했을 때
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "1학년"
        };
        request(functions.config().service_url.app)
            .post('/setting/setting_service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                // console.log(element);
                expect(element.text)
                    .to
                    .include("이미 같은 학년");

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .include('나의 학년을');
                expect(elementQuick.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
        });

    it(
        'responds change user status data before choose',
        done => { // 학적상태 변경 전 메뉴 선택이 이루어질 때
            const userRequest = {
                user: {
                    "properties": {
                        "plusfriendUserKey": "some-id",
                        "isFriend": true
                    }
                },
                utterance: "나의 학적상태를 변경할게"
            };
            request(functions.config().service_url.app)
                .post('/setting/setting_service')
                .set('Accept', 'application/json')
                .type('application/json')
                .send({userRequest})
                .expect(201)
                .then(res => {
                    const element = res
                        .body
                        .template
                        .outputs[0]
                        .simpleText;
                    // console.log(element);
                    expect(element.text)
                        .to
                        .include("변경하고자 하는 학적상태로");

                    const elementQuick = res
                        .body
                        .template
                        .quickReplies[0];
                    const array = ['휴학해요', '재학해요', '자퇴해요', '뒤로가기'];
                    for (let index = 0; index < elementQuick.length; index++) {
                        expect(element[index].label)
                            .to
                            .include(array[index]); // 응답 블록의 바로가기 버튼명이 지정한 배열의 내용을 포함하는가
                    }
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
            }
    );
    it('responds change user status data', done => { // 학적 상태 변경이 성공했을 때
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "휴학해요"
        };
        request(functions.config().service_url.app)
            .post('/setting/setting_service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                // console.log(element);
                expect(element.text)
                    .to
                    .include("학적상태를 휴학으로");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
        });
    it('responds change user status data fail', done => { // 중복 문제로 학적상태 변경이 실패했을 때
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "휴학해요"
        };
        request(functions.config().service_url.app)
            .post('/setting/setting_service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                // console.log(element);
                expect(element.text)
                    .to
                    .include("이미 학적상태가");

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .include('나의 학적상태를');
                expect(elementQuick.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
        });

    it('responds change user engineeringStatus data before choose', done => { // 공학인증 상태 선택 전, 사용자 공학인증여부 변경 메뉴에 접근
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "나의 공학인증여부를 변경할게"
        };
        request(functions.config().service_url.app)
            .post('/setting/setting_service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                // console.log(element);
                expect(element.text)
                    .to
                    .include("변경하고자 하는 공학인증여부로");

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                const array = ['O', 'X', '뒤로가기'];
                for (let index = 0; index < elementQuick.length; index++) {
                    expect(element[index].label)
                        .to
                        .include(array[index]); // 응답 블록의 바로가기 버튼명이 지정한 배열의 내용을 포함하는가
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    it('responds change user engineeringStatus data', done => { // 공학인증여부 변경이 성공했을 때
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "공학인증 안해요"
        };
        request(functions.config().service_url.app)
            .post('/setting/setting_service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                // console.log(element);
                expect(element.text)
                    .to
                    .include("공학인증여부를 공학인증 미진행");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    it('responds change user engineeringStatus data fail', done => { // 공학인증여부 변경이 실패했을 때
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "공학인증 안해요"
        };
        request(functions.config().service_url.app)
            .post('/setting/setting_service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                // console.log(element);
                expect(element.text)
                    .to
                    .include("이미 공학인증을");
                
                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .include('나의 공학인증여부를');
                expect(elementQuick.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    it('responds delete user', done => { // 사용자를 컴공봇에서 삭제했을 때
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "네"
            // utterance: "자퇴해요"
        };
        request(functions.config().service_url.app)
            .post('/setting/setting_service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                // console.log(element);
                expect(element.text)
                    .to
                    .include("전체 설정이 초기화");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
        });
});