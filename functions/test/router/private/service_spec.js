const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /private/service', () => { // 테스트 수트
    it('responds resultOut', done => { // 테스트 단위 : 선택한 메뉴의 응답 데이터가 출력되는가
        const userRequest = { // 기본 사용자 정보 시나리오
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID, // 사용자 카카오 채널 아이디
                    "isFriend": true // 채널 추가 상태
                }
            },
            utterance: "단톡 공지사항을 조회해줘" // 사용자 요청 발화문
        };

        request(functions.config().test_url.app) // 테스트 하려는 기본 주소
            .post('/private/service') // 주소의 엔드포인트
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest}) // body 데이터 전송
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
                    .a('string'); // 응답 블록이 문자열 타입인가
                expect(element.text)
                    .to
                    .equal('현재 해당 서비스는 개발 진행하고 있습니다.'); // 응답 결과가 작성한 텍스트 내용과 완전일치 하는가

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .equal('뒤로 돌아갈래'); // 응답 블록의 바로가기 요청문 내용이 작성한 텍스트 내용과 완전 일치하는가
                expect(elementQuick.action)
                    .to
                    .equal('block'); // 응답 블록의 바로가기 구조가 블록 구조 인가
                expect(elementQuick.label)
                    .to
                    .include('뒤로가기'); // 응답 블록의 바로가기명이 작성한 텍스트 내용을 포함하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    it('responds resultOut2', done => {
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
            utterance: "분실문 신고 내역을 조회해줘"
        };

        request(functions.config().test_url.app)
            .post('/private/service')
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
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 블록이 오브젝트 타입인가
                expect(element.text)
                    .to
                    .be
                    .a('string'); // 응답 블록이 문자열 타입인가
                expect(element.text)
                    .to
                    .equal('현재 해당 서비스는 개발 진행하고 있습니다.'); // 응답 결과가 작성한 텍스트 내용과 완전일치 하는가

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .equal('뒤로 돌아갈래'); // 응답 블록의 바로가기 요청문 내용이 작성한 텍스트 내용과 완전 일치하는가
                expect(elementQuick.action)
                    .to
                    .equal('block'); // 응답 블록의 바로가기 구조가 블록 구조 인가
                expect(elementQuick.label)
                    .to
                    .include('뒤로가기'); // 응답 블록의 바로가기명이 작성한 텍스트 내용을 포함하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    it('responds resultOut3', done => {
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
            utterance: "학과 SNS 공지사항을 조회해줘"
        };

        request(functions.config().test_url.app)
            .post('/private/service')
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
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 블록이 오브젝트 타입인가
                expect(element.text)
                    .to
                    .be
                    .a('string'); // 응답 블록이 문자열 타입인가
                expect(element.text)
                    .to
                    .equal('현재 해당 서비스는 개발 진행하고 있습니다.'); // 응답 결과가 작성한 텍스트 내용과 완전일치 하는가

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .equal('뒤로 돌아갈래'); // 응답 블록의 바로가기 요청문 내용이 작성한 텍스트 내용과 완전 일치하는가
                expect(elementQuick.action)
                    .to
                    .equal('block'); // 응답 블록의 바로가기 구조가 블록 구조 인가
                expect(elementQuick.label)
                    .to
                    .include('뒤로가기'); // 응답 블록의 바로가기명이 작성한 텍스트 내용을 포함하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});