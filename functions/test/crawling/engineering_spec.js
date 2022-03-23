const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /engineering', () => { // 테스트 수트
    it('responds crawling result', done => { // 테스트 단위(확인하고자 하는 내용을 명시)
        request(functions.config().service_url.crawling) // 테스트 하려는 기본 주소
            .get('/engineering') // 주소의 엔드포인트
            .expect(201) // 응답 상태코드
            .then(res => {
                // console.log(res);
                expect(res.body)
                    .to
                    .be
                    .an('object'); // 응답 결과가 오브젝트 타입인가
                expect(Object.keys(res.body).length)
                    .to
                    .equal(5); // 응답 결과의 갯수가 지정한 값 만큼인가
                for (let index = 1; index <= Object.keys(res.body).length; index++) {
                    expect(res.body[index])
                        .to
                        .have
                        .all
                        .keys('title', 'date', 'url'); // 응답 결과가 지정한 key 값을 지니고 있는가
                    expect(res.body[index].title)
                        .to
                        .be
                        .a('string'); // 해당 key값이 문자열 타입인가
                    expect(res.body[index].date)
                        .to
                        .be
                        .a('string');
                    expect(res.body[index].url)
                        .to
                        .be
                        .a('string');
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});