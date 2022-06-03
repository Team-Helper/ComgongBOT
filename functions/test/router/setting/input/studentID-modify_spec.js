const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /input/studentID-modify', () => { // 테스트 수트
    it(
        'responds success modify studentID',
        done => { // 테스트 단위 : 입력한 값으로 학번 변경이 성공했을 때
            const userRequest = { // 학번을 변경하는 사용자의 기본 정보 시나리오
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
            const action = { // 사용자가 입력한 학번 변경 데이터 시나리오
                detailParams: {
                    studentID: {
                        groupName: '',
                        origin: '16',
                        value: '16'
                    }
                }
            };
            request(functions.config().test_url.app) // 테스트 하려는 기본 주소
                .post('/input/studentID-modify') // 주소의 엔드포인트
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
                    expect(element.text)
                        .to
                        .be
                        .a('string');
                    expect(element.text)
                        .to
                        .equal("🔄 입력하신 학번으로 변경이 완료되었습니다."); // 응답 결과가 작성한 텍스트 내용과 완전일치 하는가
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
        }
    );

    it('responds fail modify studentID', done => { // 변경이 실패했을 때
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
                studentID_modify: {
                    groupName: '',
                    origin: '16',
                    value: '번호'
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
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .equal("🚫 이미 같은 학번 이예요!"); // 응답 결과가 작성한 텍스트 내용과 완전일치 하는가

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .equal('나의 학번을 변경할게'); // 응답 블록의 바로가기 요청문이 작성한 텍스트 내용을 포함하는가
                expect(elementQuick.action)
                    .to
                    .equal('block'); // 응답 블록의 바로가기 구조가 블록 구조인가
                expect(elementQuick.label)
                    .to
                    .include('뒤로가기'); // 응답 블록의 버튼명이 작성한 텍스트 내용을 포함하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});