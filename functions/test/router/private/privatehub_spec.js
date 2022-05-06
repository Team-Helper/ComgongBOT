const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /private', () => {
    it('responds about isFriend is false', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": undefined
                }
            }
        };
        request(functions.config().service_url.app)
            .post('/private')
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
                    .include("컴공봇 채널 추가부터");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});