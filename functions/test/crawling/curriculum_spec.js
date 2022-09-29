const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /curriculum', () => {
    it('responds crawling result', done => {
        request(functions.config().test_url.crawling)
            .post('/curriculum')
            .expect(201)
            .set('Accept', 'application/json')
            .type('application/json')
            .send({
                'admin': functions
                    .config()
                    .service_key
                    .admin
            }) // 어드민 인증 key 전송
            .then(res => {
                // console.log(res);
                /* 응답 결과 구조가 지정한 데이터 타입, 내용인지를 테스트 */
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
            });
    });
});