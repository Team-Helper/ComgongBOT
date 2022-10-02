const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');
const AES = require('crypto-js/aes');

describe('POST /input/profile', () => {
    /* 테스트 단위 : 프로필 DB 생성에 성공했을 때 */
    it('responds success create profile DB', done => {
        /* 테스트 사용자의 id값 암호화 후 전송 */
        const userKey = functions
            .config()
            .service_key
            .testID;
        const encrypted = AES
            .encrypt(
                JSON.stringify(userKey),
                functions.config().service_key.aes
            )
            .toString();
        const Data = {
            'email': 'test@sungkyul.ac.kr',
            'studentID': 22,
            'userKey': encrypted
        };
        request(functions.config().test_url.app)
            .post('/input/profile')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({Data})
            .expect(201)
            .then(res => {
                const element = res.text;
                // console.log(element);
                /* 응답 결과가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .a('string');
                expect(element)
                    .to
                    .be
                    .a('string');
                expect(element)
                    .to
                    .equal('Create user profile success');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});