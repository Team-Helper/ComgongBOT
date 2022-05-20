const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /completionSystem', () => { // 테스트 수트
    it('responds crawling result', done => { // 테스트 단위(확인하고자 하는 내용을 명시)
        request(functions.config().service_url.crawling) // 테스트 하려는 기본 주소
            .get('/completionSystem') // 주소의 엔드포인트
            .expect(201) // 응답 상태코드
            .then(res => {
                const element = res.body;
                console.log(element);
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 결과가 오브젝트 타입인가
                expect(Object.keys(element).length)
                    .to
                    .equal(2); // 응답 결과의 갯수가 지정한 값 만큼인가
                for (let index = 0; index < Object.keys(element).length; index++) {
                    const thisYear = new Date().getFullYear();
                    expect(element[index])
                        .to
                        .have
                        .all
                        .keys('imgAlt', 'imgURL'); // 응답 결과가 지정한 key 값을 지니고 있는가
                    expect(element[index].imgURL)
                        .to
                        .be
                        .a('string'); // 응답 결과가 문자열 타입인가
                    expect(element[index].imgURL)
                        .to
                        .include('jpg'); // 응답 결과가 jpg 파일명인가
                    expect(element[index].imgURL)
                        .to
                        .include(thisYear); // 응답 결과가 올해 날짜가 적힌 내용을 포함하는가
                    expect(element[index].imgAlt)
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