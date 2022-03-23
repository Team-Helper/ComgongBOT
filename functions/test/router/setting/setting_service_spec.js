const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/setting_service', () => { // 테스트 수트
    it('responds delete user', done => { // 테스트 단위(확인하고자 하는 내용을 명시)
        const userRequest = { // 기본 사용자 정보 시나리오와 요청 발화문
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "네"
            // utterance: "자퇴해요"
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
                    .include("전체 설정이 초기화"); // 응답 결과 값이 작성한 텍스트 내용을 포함하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });

    it('responds change user status data before choose', done => {
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
                    .include("변경하고자 하는 학적상태를");

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
            })
        });
    it('responds change user status data', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "휴학해요"
            // utterance: "재학해요"
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
                // expect(element.text)     .to     .include("학적상태를 재학으로");

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
            })
        });

    it('responds change user grade data before choose', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "나의 학년을 변경할게"
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
                    .include("변경하고자 하는 학년으로");

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                const array = ['1', '2', '3', '4', '뒤로가기'];
                for (let index = 0; index < elementQuick.length; index++) {
                    expect(element[index].label)
                        .to
                        .include(array[index]);
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds change user grade data', done => {
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
            })
        });
});