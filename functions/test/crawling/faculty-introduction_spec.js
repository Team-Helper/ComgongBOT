const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /facultyIntroduction', () => { // 테스트 수트
    it('responds crawling result', done => { // 테스트 단위(확인하고자 하는 내용을 명시)
        request(functions.config().test_url.crawling) // 테스트 하려는 기본 주소
            .get('/facultyIntroduction') // 주소의 엔드포인트
            .expect(201) // 응답 상태코드
            .then(res => {
                // console.log(res);
                expect(res.body)
                    .to
                    .be
                    .an('object'); // 응답 결과가 오브젝트 타입인가
                expect(Object.keys(res.body).length)
                    .to
                    .equal(10); // 응답 결과의 갯수가 지정한 값 만큼인가
                for (let index = 1; index <= Object.keys(res.body).length; index++) {
                    expect(res.body[index])
                        .to
                        .have
                        .all
                        .keys('img', 'name', 'info'); // 응답 결과가 지정한 key 값을 가지고 있는가
                    expect(res.body[index].img)
                        .to
                        .be
                        .a('string'); // 해당 key의 내용 값이 문자열 타입인가
                    expect(res.body[index].name)
                        .to
                        .be
                        .a('string');
                    expect(res.body[index].info)
                        .to
                        .be
                        .a('string');
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
        });
});