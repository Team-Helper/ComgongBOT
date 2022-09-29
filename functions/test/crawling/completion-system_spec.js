const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /completionSystem', () => {
    it('responds crawling result', done => {
        request(functions.config().test_url.crawling)
            .post('/completionSystem')
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
                const element = res.body;
                // console.log(element);
                /* 응답 결과 구조가 지정한 데이터 타입, 개수인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(Object.keys(element).length)
                    .to
                    .equal(2);
                /* 응답 결과 내용이 지정한 key 값, 데이터 타입, 내용인지를 테스트 */
                for (let index = 0; index < Object.keys(element).length; index++) {
                    const thisYear = new Date().getFullYear();
                    expect(element[index])
                        .to
                        .have
                        .all
                        .keys('imgAlt', 'imgURL');
                    expect(element[index].imgURL)
                        .to
                        .be
                        .a('string');
                    expect(element[index].imgURL)
                        .to
                        .include('jpg');
                    expect(element[index].imgURL)
                        .to
                        .include(thisYear);
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