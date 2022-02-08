const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /facultyIntroduction', () => {
    it('responds crawling type', done => {
        request(functions.config().service_url.crawling)
            .get('/facultyIntroduction')
            .expect(201)
            .then(res => {
                expect(res.body)
                    .to
                    .be
                    .an('object');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds crawling length', done => {
        request(functions.config().service_url.crawling)
            .get('/facultyIntroduction')
            .expect(201)
            .then(res => {
                expect(Object.keys(res.body).length)
                    .to
                    .equal(10)
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds crawling all right keys and values', done => {
        request(functions.config().service_url.crawling)
            .get('/facultyIntroduction')
            .expect(201)
            .then(res => {
                for (let index = 1; index <= Object.keys(res.body).length; index++) {
                    expect(res.body[index])
                        .to
                        .have
                        .all
                        .keys('img', 'name', 'info')
                    expect(res.body[index].img)
                        .to
                        .be
                        .a('string')
                    expect(res.body[index].name)
                        .to
                        .be
                        .a('string')
                    expect(res.body[index].info)
                        .to
                        .be
                        .a('string')
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});