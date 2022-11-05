const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /service-officeInfo', () => {
    /* 테스트 단위 : 채널 추가가 안되어있을 때 */
    it('responds isFriend is false', done => {
        /* 테스트 사용자의 채널추가, 프로필 정보 명시 */
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": undefined
                }
            }
        };
        request(functions.config().test_url.app)
            .post('/officeInfo')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                // console.log(element);
                /* 응답 결과가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .include("컴공봇 채널 추가부터");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    /* 테스트 단위 : 채널 추가가 완료되어있을 때 */
    it('responds service-officeInfo', done => {
        /* 테스트 사용자의 채널추가, 프로필 정보 명시 */
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            }
        };
        request(functions.config().test_url.app)
            .post('/officeInfo')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                // console.log(element);
                /* 응답 블록의 구조와 내용이 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .includes("성결관")
                    .includes("031");

                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});