const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /input/credit', () => {
    /* 테스트 단위 : 프로필 DB에 학점 데이터 입력을 성공했을 때 */
    it('responds success input credits to profile DB', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            },
            utterance: "네"
        };
        /* 테스트 사용자의 학점 값 시나리오 */
        const action = {
            detailParams: {
                majorMust: {
                    'groupName': '',
                    'origin': '12',
                    'value': '12'
                },
                majorChoice: {
                    'groupName': '',
                    'origin': '24',
                    'value': '24'
                },
                electiveMust: {
                    'groupName': '',
                    'origin': '36',
                    'value': '36'
                },
                electiveChoice: {
                    'groupName': '',
                    'origin': '48',
                    'value': '48'
                },
                total: {
                    'groupName': '',
                    'origin': '123',
                    'value': '123'
                }
            }
        };
        request(functions.config().test_url.app)
            .post('/input/credit')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .send({action})
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
                    .include("학점 입력이 완료되었습니다!");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
    /* 학점 입력 후 테스트 단위의 졸업 학번-학점DB 생성 */
    after(() => {
        request(functions.config().test_url.crawling)
            .post('/createTestDB')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({
                'admin': functions
                    .config()
                    .service_key
                    .admin
            }) // 어드민 인증 key 전송
            .expect(201)
            .then(res => {
                const element = res.statusCode;
                expect(element)
                    .to
                    .equal(201);
            })
            .catch(err => {
                console.error("Error >>", err);
            });
    });
});