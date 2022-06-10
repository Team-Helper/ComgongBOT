const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /input/credit-modify', () => { // 테스트 수트
    it(
        'responds success modify credit',
        done => { // 테스트 단위 : 입력한 값으로 학점 수정에 성공했을 때
            const userRequest = { // 학점을 수정하는 사용자의 기본 정보 시나리오
                user: {
                    "properties": {
                        "plusfriendUserKey": functions
                            .config()
                            .service_key
                            .testID, // 사용자 카카오 채널 아이디
                        "isFriend": true // 채널 추가 상태
                    }
                }
            };
            const action = { // 사용자가 선택 및 입력한 학점 수정 데이터 시나리오 (교과목, 학점)
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
            request(functions.config().test_url.app) // 테스트 하려는 기본 주소
                .post('/input/credit-modify') // 주소의 엔드포인트
                .set('Accept', 'application/json')
                .type('application/json')
                .send({userRequest}) // body 데이터 전송(하단 포함)
                .send({action})
                .expect(201) // 응답 상태코드
                .then(res => {
                    const element = res
                        .body
                        .template
                        .outputs[0]
                        .simpleText;
                    // console.log(element);
                    expect(element)
                        .to
                        .be
                        .an('object'); // 응답 블록이 오브젝트 타입인가
                    expect(element.text)
                        .to
                        .be
                        .a('string'); // 응답 블록의 내용이 문자열 타입인가
                    expect(element.text)
                        .to
                        .include('입력하신 학점으로 수정'); // 응답 블록의 내용이 작성한 텍스트 내용을 포함하는가
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
        }
    );

    it('responds fail modify credit', done => { // 중복 문제로 수정에 실패했을 때
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
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 블록이 오브젝트 타입인가
                expect(element.text)
                    .to
                    .be
                    .a('string'); // 응답 블록의 내용이 문자열 타입인가
                expect(element.text)
                    .to
                    .include('이미 같은 학점 이예요!'); // 응답 블록의 내용이 작성한 텍스트 내용을 포함하는가

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .include('나의 학점을 수정'); // 응답 블록의 바로가기 요청문이 작성한 텍스트 내용을 포함하는가
                expect(elementQuick.action)
                    .to
                    .equal('block'); // 응답 블록의 바로가기 구조가 블록 구조인가
                expect(elementQuick.label)
                    .to
                    .include('뒤로가기'); // 응답 블록의 바로가기 버튼명이 작성한 텍스트 내용을 포함하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});