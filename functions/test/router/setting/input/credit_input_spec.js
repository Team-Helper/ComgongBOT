const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/credit_input', () => { // 테스트 수트
    it(
        'responds success input credits to profile DB',
        done => { // 테스트 단위(확인하고자 하는 내용을 명시)
            const userRequest = { // 학점을 입력하려는 사용자의 기본 정보 시나리오와 요청 발화문
                user: {
                    "properties": {
                        "plusfriendUserKey": "some-id", // 사용자 카카오 채널 아이디
                        "isFriend": true // 채널 추가 상태
                    }
                },
                utterance: "네"
            };
            const action = {
                detailParams: { // 사용자가 입력한 학점 데이터 시나리오 (이메일, 학년, 학번)
                    majorA: {
                        'groupName': '',
                        'origin': '1',
                        'value': '1'
                    },
                    majorB: {
                        'groupName': '',
                        'origin': '2',
                        'value': '2'
                    },
                    geA: {
                        'groupName': '',
                        'origin': '3',
                        'value': '3'
                    },
                    geB: {
                        'groupName': '',
                        'origin': '4',
                        'value': '4'
                    },
                    total: {
                        'groupName': '',
                        'origin': '15',
                        'value': '15'
                    }
                }
            };
            request(functions.config().service_url.app) // 테스트 하려는 기본 주소
                .post('/setting/credit_input') // 주소의 엔드포인트
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
                        .include("학점 입력이 완료되었습니다"); // 응답 결과가 작성한 텍스트의 내용을 포함하는가
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                })
            }
    );
});