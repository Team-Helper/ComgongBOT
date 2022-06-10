const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /education', () => { // 테스트 수트
    it('responds crawling result', done => { // 테스트 단위 : 크롤링 결과 확인
        request(functions.config().test_url.crawling) // 테스트 하려는 기본 주소
            .get('/education') // 주소의 엔드포인트
            .expect(201) // 응답 상태코드
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
                expect(res.body)
                    .to
                    .be
                    .an('object'); // 응답 결과가 오브젝트 타입인가
                expect(Object.keys(res.body).length)
                    .to
                    .equal(5); // 응답 결과의 갯수가 지정한 값 만큼인가
                for (let index = 1; index <= Object.keys(res.body).length; index++) {
                    expect(res.body[index])
                        .to
                        .have
                        .all
                        .keys('title', 'date', 'url'); // 응답 결과가 지정한 key 값을 지니고 있는가
                    expect(res.body[index].title)
                        .to
                        .be
                        .a('string'); // 응답 결과인 게시물 제목이 문자열 타입인가
                    expect(res.body[index].date)
                        .to
                        .be
                        .a('string'); // 응답 결과인 게시물 업로드 날짜가 문자열 타입인가
                    expect(res.body[index].url)
                        .to
                        .be
                        .a('string'); // 응답 결과인 게시물 주소가 문자열 타입인가
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});