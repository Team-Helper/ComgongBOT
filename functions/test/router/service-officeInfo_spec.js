const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /service-officeInfo', () => { // 테스트 수트
    it('responds service-officeInfo', done => { // 테스트 단위 : 선택한 메뉴의 응답 데이터가 출력되는가
        const userRequest = { // 기본 사용자 정보 시나리오
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

        request(functions.config().test_url.app) // 테스트 하려는 기본 주소
            .post('/officeInfo') // 주소의 엔드포인트
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
                    .an('object'); // 응답 블록의 구조가 아이템 카드 구조인가
                expect(element.text)
                    .to
                    .be
                    .a('string'); // 응답 블록의 내용이 문자열 타입인가
                expect(element.text)
                    .to
                    .includes("학과 사무실 주소", "학과 사무실 연락처"); // 응답 블록의 내용이 작성한 텍스트 내용을 포함하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});