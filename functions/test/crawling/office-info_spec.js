const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /officeInfo', () => {
    it('responds crawling type', done => {
        request(functions.config().test_url.crawling)
            .post('/officeInfo')
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
                /* 응답 결과 구조가 지정한 데이터 타입, 개수인지를 테스트 */
                expect(res.body)
                    .to
                    .be
                    .an('object');
                expect(Object.keys(res.body).length)
                    .to
                    .equal(2);
                /* 응답 결과 내용이 지정한 key 값, 데이터 타입인지를 테스트 */
                expect(res.body)
                    .to
                    .have
                    .all
                    .keys('address', 'tel');
                expect(res.body.address)
                    .to
                    .be
                    .a('string');
                expect(res.body.tel)
                    .to
                    .be
                    .a('string');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});