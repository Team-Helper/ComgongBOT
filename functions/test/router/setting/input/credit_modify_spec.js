const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/credit_modify', () => {
    const userRequest = {
        user: {
            "properties": {
                "plusfriendUserKey": "some-id",
                "isFriend": true
            }
        }
    };
    const action = {
        detailParams: {
            menu: {
                'groupName': '',
                'origin': '총 학점',
                'value': 'total'
            },
            credit: {
                'groupName': '',
                'origin': '15',
                'value': '15'
            }
        }
    }

    it('responds try to same change credit', done => {
        request(functions.config().service_url.app)
            .post('/setting/credit_modify')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .send({action})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                expect(element.text)
                    .to
                    .include('이미 같은 학점');

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .include('나의 학점을 수정');
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

describe('POST /setting/credit_modify', () => {
    const userRequest = {
        user: {
            "properties": {
                "plusfriendUserKey": "some-id",
                "isFriend": true
            }
        }
    };
    const action = {
        detailParams: {
            menu: {
                'groupName': '',
                'origin': '총 학점',
                'value': 'total'
            },
            credit: {
                'groupName': '',
                'origin': '12345',
                'value': '12345'
            }
        }
    }

    it('responds success change credit', done => {
        request(functions.config().service_url.app)
            .post('/setting/credit_modify')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .send({action})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                expect(element.text)
                    .to
                    .include('입력하신 학점으로 수정');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});