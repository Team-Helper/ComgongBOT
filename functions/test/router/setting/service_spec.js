const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/service', () => {
    /* 테스트 단위 : 전체 학점을 삭제할 때 */
    it('responds choose menu before delete user credits data', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            },
            utterance: "나의 전체 학점을 삭제할게"
        };
        request(functions.config().test_url.app)
            .post('/setting/service')
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
                /* 응답 결과 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .include("전체 학점을 삭제합니다.");

                const elementQuick = res.body.template.quickReplies;
                const array = ['네', '아니오'];
                // console.log(elementQuick);
                /* 관련 바로가기 응답 결과가 지정한 개수, 내용인지를 테스트 */
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
    });
    /* 테스트 단위 : 전체 학점 삭제를 성공했을 때 */
    it('responds delete user credits data', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            },
            utterance: "네, 삭제해주세요"
        };
        request(functions.config().test_url.app)
            .post('/setting/service')
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
                /* 응답 결과가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .include("전체 학점이 삭제되었습니다.");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
    /* 테스트 단위 : 전체 학점 삭제를 실패했을 때 */
    it('responds delete user credits data fail', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            },
            utterance: "네, 삭제해주세요"
        };
        request(functions.config().test_url.app)
            .post('/setting/service')
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
                /* 응답 결과 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .include("학점이 존재하지 않습니다.");

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 관련 바로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .include('나의 학점을');
                expect(elementQuick.action)
                    .to
                    .equal('block');
                expect(elementQuick.label)
                    .to
                    .include('학점 입력');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    /* 테스트 단위 : 공학인증 상태 변경 메뉴 선택을 할 때 */
    it('responds choose menu before change user engineeringStatus data', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            },
            utterance: "나의 공학인증여부를 변경할게"
        };
        request(functions.config().test_url.app)
            .post('/setting/service')
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
                /* 응답 결과 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
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
                /* 관련 바로가기 응답 결과가 지정한 개수, 내용인지를 테스트 */
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
    });
    /* 테스트 단위 : 공학인증 여부 변경이 성공했을 때 */
    it('responds change user engineeringStatus data', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            },
            utterance: "공학인증 안해요"
        };
        request(functions.config().test_url.app)
            .post('/setting/service')
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
                /* 응답 결과가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .include("공학인증여부를 공학인증 미진행으로 변경완료 하였습니다.");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
    /* 테스트 단위 : 공학인증 여부 변경이 실패했을 때 */
    it('responds change user engineeringStatus data fail', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            },
            utterance: "공학인증 안해요"
        };
        request(functions.config().test_url.app)
            .post('/setting/service')
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
                /* 응답 결과 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
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
                /* 관련 바로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
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
    });

    /* 테스트 단위 : 초기화 메뉴 선택할 때 */
    it('responds choose menu before delete user', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            },
            utterance: "설정을 초기화 해줘"
        };
        request(functions.config().test_url.app)
            .post('/setting/service')
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
                /* 응답 결과 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .include("전체 설정이 초기화 됩니다. 정말 진행을 원하시나요?");

                const elementQuick = res.body.template.quickReplies;
                const array = ['네', '아니오'];
                // console.log(elementQuick);
                /* 관련 바로가기 응답 결과가 지정한 개수, 내용인지를 테스트 */
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
    });
    /* 초기화에 성공했을 때 */
    it('responds delete user', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            },
            utterance: "네, 초기화해주세요"
        };
        request(functions.config().test_url.app)
            .post('/setting/service')
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
                /* 응답 결과가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .include("전체 설정이 초기화 되었습니다.");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});