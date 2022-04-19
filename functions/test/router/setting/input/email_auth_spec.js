const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/email_auth', () => { // 테스트 수트
    it(
        'responds success create profile DB',
        done => { // 테스트 단위 : 프로필 DB 생성에 성공했을 때
            const userRequest = { // 인증하려는 사용자의 기본 정보 시나리오
                user: {
                    "properties": {
                        "plusfriendUserKey": "some-id", // 사용자 카카오 채널 아이디
                        "isFriend": true // 채널 추가 상태
                    }
                }
            };
            const action = {
                detailParams: { // 사용자가 입력한 프로필 데이터 시나리오 (이메일, 학년, 학번)
                    email: {
                        'groupName': '',
                        'origin': 'test@sungkyul.ac.kr',
                        'value': 'test@sungkyul.ac.kr'
                    },
                    grade: {
                        'groupName': '',
                        'origin': '4',
                        'value': 'grade'
                    },
                    studentID: {
                        'groupName': '',
                        'origin': '16',
                        'value': 'studentID'
                    }
                }
            };
            request(functions.config().service_url.app) // 테스트 하려는 기본 주소
                .post('/setting/email_auth') // 주소의 엔드포인트
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
                    expect(element.text)
                        .to
                        .equal('✅ 프로필 생성이 완료되었습니다!\n하단의 버튼을 통해 본인의 학점도 바로 입력해보세요.'); // 응답 결과가 작성한 텍스트의 내용과 완전 일치하는가

                    const elementQuick = res
                        .body
                        .template
                        .quickReplies[0];
                    // console.log(elementQuick);
                    expect(elementQuick.messageText)
                        .to
                        .equal('학점 입력할게'); // 응답 블록의 바로가기 요청문이 작성한 텍스트의 내용과 완전 일치하는가
                    expect(elementQuick.label)
                        .to
                        .equal('학점 입력'); // 응답 블록의 바로가기 버튼명이 작성한 텍스트의 내용과 완전 일치하는가
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
            }
    );
});