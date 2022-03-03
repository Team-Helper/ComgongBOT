const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting_service', () => {
    it('responds checkOut1', done => {
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
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});