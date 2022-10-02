const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /input/studentID-modify', () => {
    /* 테스트 단위 : 입력한 값으로 학번 변경에 성공했을 때 */
    it('responds success modify studentID', done => {
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
        /* 테스트 사용자의 학번 변경 데이터 시나리오 */
        const action = {
            detailParams: {
                studentID: {
                    groupName: '',
                    origin: '16',
                    value: '16'
                }
            }
        };
        request(functions.config().test_url.app)
            .post('/input/studentID-modify')
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
                    .include("입력하신 학번으로 변경이 완료");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
    /* 테스트 단위 : 중복 문제로 변경에 실패했을 때 */
    it('responds fail modify studentID', done => {
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
                studentID: {
                    groupName: '',
                    origin: '16',
                    value: '16'
                }
            }
        };
        request(functions.config().test_url.app)
            .post('/input/studentID-modify')
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
                    .include("이미 같은 학번 이예요!");

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .equal('나의 학번을 변경할게');
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