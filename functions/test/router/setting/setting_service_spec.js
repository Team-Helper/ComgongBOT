const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/setting_service', () => {
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
                    .include("전체 설정이 초기화 되었습니다");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });

    it('responds change user data', done => {
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
                    .include("전체 설정이 초기화 되었습니다");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});