const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /curriculum', () => { // 테스트 수트
    it('responds crawling result', done => { // 테스트 단위(확인하고자 하는 내용을 명시)
        request(functions.config().test_url.crawling) // 테스트 하려는 기본 주소
            .get('/curriculum') // 주소의 엔드포인트
            .expect(201) // 응답 상태코드
            .set('Accept', 'application/json')
            .type('application/json')
            .send({
                'admin': functions
                    .config()
                    .service_key
                    .admin
            }) // 어드민 인증 키 전송
            .then(res => {
                // console.log(res);
                expect(res.text)
                    .to
                    .be
                    .a('string'); // 응답 결과가 문자열 타입인가
                expect(res.text)
                    .to
                    .include('png'); // 응답 결과가 png 파일명인가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});