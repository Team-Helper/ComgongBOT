const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /completionSystem', () => { //테스트 수트
    it('responds crawling result', done => { //테스트 단위(확인하고자 하는 내용을 명시)
        request(functions.config().service_url.crawling) //테스트 하려는 기본 주소
            .get('/completionSystem') //주소의 엔드포인트
            .expect(201) //응답 상태코드
            .then(res => {
                //console.log(res);
                expect(res.text)
                    .to
                    .be
                    .a('string'); //응답 결과가 문자열 타입인가
                expect(res.text)
                    .to
                    .include('png'); //결과에 png 명칭이 있는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
        });
});