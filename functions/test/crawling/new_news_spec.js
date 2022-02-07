const request = require('supertest');
const {expect} = require('chai');
require('dotenv').config();

describe('GET /new_news', () => {
    it('responds crawling type', done => {
        request(process.env.crawlingUrl)
            .get('/new_news')
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
            .get('/new_news')
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
    it('responds crawling all right keys', done => {
        request(process.env.crawlingUrl)
            .get('/new_news')
            .expect(201)
            .then(res => {
                for (let index = 1; index <= Object.keys(res.body).length; index++) {
                    expect(res.body[index])
                        .to
                        .have
                        .all
                        .keys('title', 'date', 'url')
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds crawling values type of the key', done => {
        request(process.env.crawlingUrl)
            .get('/new_news')
            .expect(201)
            .then(res => {
                for (let index = 1; index <= Object.keys(res.body).length; index++) {
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