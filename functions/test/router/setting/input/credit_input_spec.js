const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/credit_input', () => {
    it('responds delete user', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "네"
        };
        const action = {
            detailParams: {
                majorA: {
                    value: '{"amount": 1}'
                },
                majorB: {
                    value: '{"amount": 2}'
                },
                geA: {
                    value: '{"amount": 3}'
                },
                geB: {
                    value: '{"amount": 4}'
                },
                total: {
                    value: '{"amount": 5}'
                }
            }
        }

        request(functions.config().service_url.app)
            .post('/setting/credit_input')
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
                // console.log(element);
                expect(element.text)
                    .to
                    .include("학점 입력이 완료되었습니다");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});