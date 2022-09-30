const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /checkNumber', () => {
    /* 테스트 단위 : 입력 값인 파라미터 값 검증이 올바를 떄 */
    it('responds check parameter is a number', done => {
        const utterance = 12345;
        request(functions.config().test_url.crawling)
            .post('/checkNumber')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({utterance})
            .expect(200)
            .then(res => {
                const element = res.body;
                // console.log(element);
                /* 응답 결과의 상태 값이 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element.status)
                    .to
                    .be
                    .a('string');
                expect(element.status)
                    .to
                    .equal('SUCCESS');

                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    /* 테스트 단위 :  입력 값인 파라미터 값 검증이 올바르지 않을 떄  */
    it('responds check parameter is not a number', done => {
        const utterance = 'testText';

        request(functions.config().test_url.crawling)
            .post('/checkNumber')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({utterance})
            .expect(400)
            .then(res => {
                const element = res.body;
                // console.log(element);
                /* 응답 결과의 상태 값이 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element.status)
                    .to
                    .be
                    .a('string');
                expect(element.status)
                    .to
                    .equal('FAIL');

                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});