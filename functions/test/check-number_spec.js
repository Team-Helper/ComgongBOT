const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /checkNumber', () => { // 테스트 수트
    it('responds check parameter is a number', done => { // 테스트 단위 : 파라미터 검증이 올바를 때
        const utterance = 12345;

        request(functions.config().test_url.crawling) // 테스트 하려는 기본 주소
            .post('/checkNumber') // 주소의 엔드포인트
            .set('Accept', 'application/json')
            .type('application/json')
            .send({utterance}) // body 데이터 전송
            .expect(200) // 응답 상태코드
            .then(res => {
                const element = res.body;
                // console.log(element);
                expect(element.status)
                    .to
                    .be
                    .a('string'); // 응답 결과의 상태가 문자열 타입인가
                expect(element.status)
                    .to
                    .equal('SUCCESS'); // 응답 결과의 상태 문자 내용이 작성한 텍스트와 완전일치 하는가
                expect(element.message)
                    .to
                    .be
                    .a('string'); // 응답 결과의 메시지가 문자열 타입인가
                expect(element.message)
                    .to
                    .equal('this is a number'); // 응답 결과의 메시지 내용이 작성한 텍스트와 완전일치 하는가

                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    it(
        'responds check parameter is not a number',
        done => { // 테스트 단위 : 파라미터 검증이 올바르지 않을 때
            const utterance = 'testText';

            request(functions.config().test_url.crawling) // 테스트 하려는 기본 주소
                .post('/checkNumber') // 주소의 엔드포인트
                .set('Accept', 'application/json')
                .type('application/json')
                .send({utterance}) // body 데이터 전송
                .expect(400) // 응답 상태코드
                .then(res => {
                    const element = res.body;
                    // console.log(element);
                    expect(element.status)
                        .to
                        .be
                        .a('string'); // 응답 결과의 상태가 문자열 타입인가
                    expect(element.status)
                        .to
                        .equal('FAIL'); // 응답 결과의 상태 문자 내용이 작성한 텍스트와 완전일치 하는가
                    expect(element.message)
                        .to
                        .be
                        .a('string'); // 응답 결과의 메시지가 문자열 타입인가
                    expect(element.message)
                        .to
                        .equal('this is not a number!'); // 응답 결과의 메시지 내용이 작성한 텍스트와 완전일치 하는가

                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
        }
    );
});