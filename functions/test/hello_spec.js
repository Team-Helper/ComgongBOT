const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /', () => {
    it('responds: ', done => {
        request(functions.config().service_url.app)
            .post('/')
            .expect(200)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0];
                console.log(element);
                done();
            })
            .catch(err => {
                console.error("######Error >>", err);
                done(err);
            })
        });
});