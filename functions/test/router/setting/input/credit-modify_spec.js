const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /input/credit-modify', () => {
    /* 테스트 단위 : 입력한 값으로 학점 수정에 성공했을 때 */
    it('responds success modify credit', done => {
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
        /* 테스트 사용자의 교과목 선택 및 해당 과목 수정 값 데이터 시나리오 */
        const action = {
            detailParams: {
                menu: {
                    'groupName': '',
                    'origin': '총 학점',
                    'value': 'total'
                },
                credit: {
                    'groupName': '',
                    'origin': '12345',
                    'value': '12345'
                }
            }
        };
        request(functions.config().test_url.app)
            .post('/input/credit-modify')
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
                    .include('입력하신 학점으로 수정');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    /* 테스트 단위 : 중복 문제로 수정에 실패했을 때 */
    it('responds fail modify credit', done => {
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
        const action = {
            detailParams: {
                menu: {
                    'groupName': '',
                    'origin': '총 학점',
                    'value': 'total'
                },
                credit: {
                    'groupName': '',
                    'origin': '12345',
                    'value': '12345'
                }
            }
        };
        request(functions.config().test_url.app)
            .post('/input/credit-modify')
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
                    .include('이미 같은 학점 이예요!');

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .include('나의 학점을 수정');
                expect(elementQuick.action)
                    .to
                    .equal('block');
                expect(elementQuick.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});