const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /input/credit', () => { // 테스트 수트
    it(
        'responds success input credits to profile DB',
        done => { // 테스트 단위 : 프로필 DB에 학점 데이터 입력을 성공했을 때
            const userRequest = { // 학점을 입력하려는 사용자의 기본 정보 시나리오와 요청 발화문
                user: {
                    "properties": {
                        "plusfriendUserKey": functions
                            .config()
                            .service_key
                            .testID, // 사용자 카카오 채널 아이디
                        "isFriend": true // 채널 추가 상태
                    }
                },
                utterance: "네"
            };
            const action = {
                detailParams: { // 사용자가 입력한 학점 데이터 시나리오 (이메일, 학년, 학번)
                    majorA: {
                        'groupName': '',
                        'origin': '12',
                        'value': '12'
                    },
                    majorB: {
                        'groupName': '',
                        'origin': '24',
                        'value': '24'
                    },
                    geA: {
                        'groupName': '',
                        'origin': '36',
                        'value': '36'
                    },
                    geB: {
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
            request(functions.config().test_url.app) // 테스트 하려는 기본 주소
                .post('/input/credit') // 주소의 엔드포인트
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
                        .equal("✅ 학점 입력이 완료되었습니다!\n이제 학과 개인 서비스도 이용하실 수 있게 되었습니다."); // 응답 결과가 작성한 텍스트의 내용과 완전일치 하는가
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
        }
    );
    after(() => {
        request(functions.config().test_url.crawling) // 테스트 하려는 기본 주소
            .get('/createTestDB') // 주소의 엔드포인트
            .set('Accept', 'application/json')
            .type('application/json')
            .expect(200) // 응답 상태코드
            .then(res => {
                const element = res.statusCode;
                expect(element)
                    .to
                    .equal(200); // 테스트 DB 생성 후 응답 상태 코드 확인
            })
            .catch(err => {
                console.error("Error >>", err);
            });
    });
});