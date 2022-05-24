const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/setting_service', () => { // 테스트 수트
    it(
        'responds choose menu before change user grade data',
        done => { // 테스트 단위 : 학년 변경 전, 메뉴 선택이 이루어질 때
            /* 기본 사용자 정보 시나리오와 요청 발화문 */
            const userRequest = {
                user: {
                    "properties": {
                        "plusfriendUserKey": functions.config().service_key.myKey,
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
                        .be
                        .a('string'); // 응답 블록의 내용이 문자열 타입인가
                    expect(element.text)
                        .to
                        .include("변경하고자 하는 학년으로"); // 응답 블록 내용이 작성한 텍스트 내용을 포함하는가

                    const elementQuick = res.body.template.quickReplies;
                    const array = ['1', '2', '3', '4', '뒤로가기'];
                    // console.log(elementQuick);
                    expect(Object.keys(elementQuick).length)
                        .to
                        .equal(array.length); // 응답 블록의 바로가기 개수가 지정한 배열 사이즈와 동일한가
                    for (let index = 0; index < Object.keys(elementQuick).length; index++) {
                        expect(elementQuick[index].label)
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
                    "plusfriendUserKey": functions.config().service_key.myKey,
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
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .equal("🔄 선택하신 학년으로 변경이 완료되었습니다."); // 응답 블록의 내용이 작성한 텍스트 내용과 완전일치 하는가
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
                    "plusfriendUserKey": functions.config().service_key.myKey,
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
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .include("이미 같은 학년"); // 응답 블록의 내용이 작성한 텍스트 내용을 포함하는가

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .include('나의 학년을'); // 응답 블록의 요청문이 작성한 텍스트 내용을 포함하는가
                expect(elementQuick.action)
                    .to
                    .equal('block'); // 응답 블록의 바로가기 구조가 블록 구조 인가
                expect(elementQuick.label)
                    .to
                    .include('뒤로가기'); // 응답 블록의 바로가기 버튼명이 작성한 텍스트 내용을 포함하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    it(
        'responds choose menu before change user status data',
        done => { // 학적상태 변경 전, 메뉴 선택이 이루어질 때
            const userRequest = {
                user: {
                    "properties": {
                        "plusfriendUserKey": functions.config().service_key.myKey,
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
                        .be
                        .a('string');
                    expect(element.text)
                        .to
                        .include("변경하고자 하는 학적상태로");

                    const elementQuick = res.body.template.quickReplies;
                    const array = ['휴학해요', '재학해요', '자퇴해요', '뒤로가기'];
                    // console.log(elementQuick);
                    expect(Object.keys(elementQuick).length)
                        .to
                        .equal(array.length);
                    for (let index = 0; index < Object.keys(elementQuick).length; index++) {
                        expect(elementQuick[index].label)
                            .to
                            .include(array[index]);
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
                    "plusfriendUserKey": functions.config().service_key.myKey,
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
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .equal("🔄 학적상태를 휴학으로 변경완료 하였습니다.");
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
                    "plusfriendUserKey": functions.config().service_key.myKey,
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
                    .be
                    .a('string');
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
                expect(elementQuick.action)
                    .to
                    .equal('block');
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
        'responds choose menu before change user engineeringStatus data',
        done => { // 공학인증 상태 선택 전, 메뉴 선택이 이루어질 때
            const userRequest = {
                user: {
                    "properties": {
                        "plusfriendUserKey": functions.config().service_key.myKey,
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
                        .be
                        .a('string');
                    expect(element.text)
                        .to
                        .include("변경하고자 하는 공학인증여부로");

                    const elementQuick = res.body.template.quickReplies;
                    const array = ['O', 'X', '뒤로가기'];
                    // console.log(elementQuick);
                    expect(Object.keys(elementQuick).length)
                        .to
                        .equal(array.length);
                    for (let index = 0; index < Object.keys(elementQuick).length; index++) {
                        expect(elementQuick[index].label)
                            .to
                            .include(array[index]);
                    }
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
        }
    );

    it(
        'responds change user engineeringStatus data',
        done => { // 공학인증여부 변경이 성공했을 때
            const userRequest = {
                user: {
                    "properties": {
                        "plusfriendUserKey": functions.config().service_key.myKey,
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
                        .be
                        .a('string');
                    expect(element.text)
                        .to
                        .equal("🔄 공학인증여부를 공학인증 미진행으로 변경완료 하였습니다.");
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
        }
    );

    it(
        'responds change user engineeringStatus data fail',
        done => { // 중복 문제로 공학인증여부 변경이 실패했을 때
            const userRequest = {
                user: {
                    "properties": {
                        "plusfriendUserKey": functions.config().service_key.myKey,
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
                        .be
                        .a('string');
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
                    expect(elementQuick.action)
                        .to
                        .equal('block');
                    expect(elementQuick.label)
                        .to
                        .include('뒤로가기');
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
        }
    );

    it(
        'responds choose menu before delete user',
        done => { // ComgongBOT 초기화 전, 메뉴 선택이 이루어질 때
            const userRequest = {
                user: {
                    "properties": {
                        "plusfriendUserKey": functions.config().service_key.myKey,
                        "isFriend": true
                    }
                },
                utterance: "설정을 초기화 해줘"
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
                        .be
                        .a('string');
                    expect(element.text)
                        .to
                        .equal("‼ 전체 설정이 초기화 됩니다. 정말 진행을 원하시나요?");

                    const elementQuick = res.body.template.quickReplies;
                    const array = ['네', '아니오'];
                    // console.log(elementQuick);
                    expect(Object.keys(elementQuick).length)
                        .to
                        .equal(array.length);
                    for (let index = 0; index < Object.keys(elementQuick).length; index++) {
                        expect(elementQuick[index].label)
                            .to
                            .include(array[index]);
                    }
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
        }
    );
    it('responds delete user', done => { // 사용자가 ComgongBOT을 초기화할 때
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions.config().service_key.myKey,
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
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .equal("🗑 전체 설정이 초기화 되었습니다.");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});