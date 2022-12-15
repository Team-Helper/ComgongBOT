const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /input/credits-modify', () => {
    /* 테스트 단위 : 입력한 값으로 전체 교과목 학점 수정에 성공했을 때 */
    it('responds success modify credits', done => {
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
        /* 테스트 사용자의 전체 교과목 학점 수정 값 데이터 시나리오 */
        const action = {
            detailParams: {
                majorMust: {
                    'groupName': '',
                    'origin': parseInt('10'),
                    'value': parseInt('10')
                },
                majorChoice: {
                    'groupName': '',
                    'origin': parseInt('20'),
                    'value': parseInt('20')
                },
                electiveMust: {
                    'groupName': '',
                    'origin': parseInt('30'),
                    'value': parseInt('30')
                },
                electiveChoice: {
                    'groupName': '',
                    'origin': parseInt('40'),
                    'value': parseInt('40')
                },
                total: {
                    'groupName': '',
                    'origin': parseInt('50'),
                    'value': parseInt('50')
                }
            }
        };
        request(functions.config().test_url.app)
            .post('/input/credits-modify')
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
                    .include('입력하신 전체 교과목 학점으로 수정');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});