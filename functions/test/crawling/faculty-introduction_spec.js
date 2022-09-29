const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /facultyIntroduction', () => {
    it('responds crawling result', done => {
        request(functions.config().test_url.crawling)
            .post('/facultyIntroduction')
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
                    .equal(10);
                /* 응답 결과 내용이 지정한 key 값, 데이터 타입인지를 테스트 */
                for (let index = 1; index <= Object.keys(res.body).length; index++) {
                    expect(res.body[index])
                        .to
                        .have
                        .all
                        .keys('img', 'name', 'info');
                    expect(res.body[index].img)
                        .to
                        .be
                        .a('string');
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