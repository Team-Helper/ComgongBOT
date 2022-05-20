const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');
const AES = require('crypto-js/aes');

describe('POST /setting/email_auth', () => { // 테스트 수트
    it(
        'responds success create profile DB',
        done => { // 테스트 단위 : 프로필 DB 생성에 성공했을 때
            /* 테스트 아이디 암호화 */
            const userKey = functions
                .config()
                .service_key
                .myKey;
            const encrypted = AES
                .encrypt(
                    JSON.stringify(userKey),
                    functions.config().service_key.aes_key
                )
                .toString();
            const Data = { // 인증하려는 사용자의 기본 정보 시나리오
                'email': 'test@sungkyul.ac.kr',
                'grade': 1,
                'studentID': 22,
                'userKey': encrypted
            };
            request(functions.config().service_url.app) // 테스트 하려는 기본 주소
                .post('/setting/email_auth') // 주소의 엔드포인트
                .set('Accept', 'application/json')
                .type('application/json')
                .send({Data}) // body 데이터 전송
                .expect(201) // 응답 상태코드
                .then(res => {
                    const element = res.text;
                    // console.log(element);
                    expect(element)
                        .to
                        .be
                        .a('string'); // 응답 결과가 문자열 타입인가
                    expect(element)
                        .to
                        .equal('Create user profile success'); // 응답 결과가 작성한 텍스트 내용과 완전일치 하는가
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
        }
    );
});