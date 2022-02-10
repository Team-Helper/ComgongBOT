const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /curriculum', () => {
    it('responds crawling type', done => {
        request(functions.config().service_url.crawling)
            .get('/curriculum')
            .expect(201)
            .then(res => {
                // console.log(res.res);
                expect(res.text)
                    .to
                    .be
                    .a('string');
                expect(res.text)
                    .to
                    .include('png');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});