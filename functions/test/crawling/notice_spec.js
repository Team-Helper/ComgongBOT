const request = require('supertest');
const {expect} = require('chai');
require('dotenv').config();

describe('GET /notice', () => {
    it('responds crawling type', done => { // 크롤링 반환 타입 확인
        request(process.env.crawlingUrl)
            .get('/notice') // 크롤링 함수 주소
            .expect(201)
            .then(res => {
                // console.log(res.body);
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
    it('responds crawling length', done => { // 크롤링 된 갯수 확인
        request(process.env.crawlingUrl)
            .get('/notice')
            .expect(201)
            .then(res => {
                // console.log(res.body);
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
    it('responds crawling all right keys', done => { // 크롤링 반환 값인 오브젝트 key 값 확인
        request(process.env.crawlingUrl)
            .get('/notice')
            .expect(201)
            .then(res => {
                // console.log(Object.keys(res.body));
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
    it('responds crawling values type of the key', done => { // 크롤링 반환 값 오브젝트 value 값 확인
        request(process.env.crawlingUrl)
            .get('/notice')
            .expect(201)
            .then(res => {
                for (let index = 1; index <= Object.keys(res.body).length; index++) {
                    // console.log(typeof res.body[index].title);
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