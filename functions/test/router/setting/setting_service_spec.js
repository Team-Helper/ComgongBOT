const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/setting_service', () => {
    // it('responds delete user', done => {
    //     const userRequest = {
    //         user: {
    //             "properties": {
    //                 "plusfriendUserKey": "some-id",
    //                 "isFriend": true
    //             }
    //         },
    //         utterance: "네"
    //         // utterance: "자퇴해요"
    //     };
    //     request(functions.config().service_url.app)
    //         .post('/setting/setting_service')
    //         .set('Accept', 'application/json')
    //         .type('application/json')
    //         .send({userRequest})
    //         .expect(201)
    //         .then(res => {
    //             const element = res
    //                 .body
    //                 .template
    //                 .outputs[0]
    //                 .simpleText;
    //             console.log(element);
    //             expect(element.text)
    //                 .to
    //                 .include("전체 설정이 초기화");
    //             done();
    //         })
    //         .catch(err => {
    //             console.error("Error >>", err);
    //             done(err);
    //         })
    //     });

    // it('responds change user status data before choose', done => {
    //     const userRequest = {
    //         user: {
    //             "properties": {
    //                 "plusfriendUserKey": "some-id",
    //                 "isFriend": true
    //             }
    //         },
    //         utterance: "나의 학적상태를 변경할게"
    //     };
    //     request(functions.config().service_url.app)
    //         .post('/setting/setting_service')
    //         .set('Accept', 'application/json')
    //         .type('application/json')
    //         .send({userRequest})
    //         .expect(201)
    //         .then(res => {
    //             const element = res
    //                 .body
    //                 .template
    //                 .outputs[0]
    //                 .simpleText;
    //             // console.log(element);
    //             expect(element.text)
    //                 .to
    //                 .include("변경하고자 하는 학적상태를");

    //             const elementQuick = res
    //                 .body
    //                 .template
    //                 .quickReplies[0];
    //             const array = ['휴학해요', '재학해요', '자퇴해요', '뒤로가기'];
    //             for (let index = 0; index < elementQuick.length; index++) {
    //                 expect(element[index].label)
    //                     .to
    //                     .include(array[index]);
    //             }
    //             done();
    //         })
    //         .catch(err => {
    //             console.error("Error >>", err);
    //             done(err);
    //         })
    //     });
    // it('responds change user status data', done => {
    //     const userRequest = {
    //         user: {
    //             "properties": {
    //                 "plusfriendUserKey": "some-id",
    //                 "isFriend": true
    //             }
    //         },
    //         utterance: "휴학해요"
    //         // utterance: "재학해요"
    //     };
    //     request(functions.config().service_url.app)
    //         .post('/setting/setting_service')
    //         .set('Accept', 'application/json')
    //         .type('application/json')
    //         .send({userRequest})
    //         .expect(201)
    //         .then(res => {
    //             const element = res
    //                 .body
    //                 .template
    //                 .outputs[0]
    //                 .simpleText;
    //             // console.log(element);
    //             expect(element.text)
    //                 .to
    //                 .include("학적상태를 휴학으로");
    //             // expect(element.text)     .to     .include("학적상태를 재학으로");

    //             const elementQuick = res
    //                 .body
    //                 .template
    //                 .quickReplies[0];
    //             // console.log(elementQuick);
    //             expect(elementQuick.messageText)
    //                 .to
    //                 .include('나의 학적상태를');
    //             expect(elementQuick.label)
    //                 .to
    //                 .include('뒤로가기');
    //             done();
    //         })
    //         .catch(err => {
    //             console.error("Error >>", err);
    //             done(err);
    //         })
    //     });

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