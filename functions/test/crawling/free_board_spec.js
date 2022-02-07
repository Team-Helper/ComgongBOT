const request = require('supertest');
const {expect} = require('chai');
require('dotenv').config();

describe('GET /freeBoard', () => {
    it('responds crawling type', done => {
        request(process.env.crawlingUrl)
            .get('/freeBoard')
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
        request(process.env.crawlingUrl)
            .get('/freeBoard')
            .expect(201)
            .then(res => {
                expect(Object.keys(res.body).length)
                    .to
                    .equal(5)
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds crawling all right keys and values', done => {
        request(process.env.crawlingUrl)
            .get('/freeBoard')
            .expect(201)
            .then(res => {
                for (let index = 1; index <= Object.keys(res.body).length; index++) {
                    expect(res.body[index])
                        .to
                        .have
                        .all
                        .keys('title', 'date', 'url')
                    expect(res.body[index].title)
                        .to
                        .be
                        .a('string')
                    expect(res.body[index].date)
                        .to
                        .be
                        .a('string')
                    expect(res.body[index].url)
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