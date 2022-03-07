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
                    groupName: '',
                    origin: '1',
                    value: '1'
                },
                majorB: {
                    groupName: '',
                    origin: '2',
                    value: '2'
                },
                geA: {
                    groupName: '',
                    origin: '3',
                    value: '3'
                },
                geB: {
                    groupName: '',
                    origin: '4',
                    value: '4'
                },
                total: {
                    groupName: '',
                    origin: '15',
                    value: '15'
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