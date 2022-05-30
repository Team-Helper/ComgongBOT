const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /personal', () => { // 테스트 수트
    it('responds about isFriend is false', done => { // 테스트 단위 : 채널 추가가 안되어있을 때
        const userRequest = { // 기본 사용자 정보 시나리오
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .myKey, // 사용자 카카오 채널 아이디
                    "isFriend": undefined // 채널 추가 상태
                }
            }
        };
        request(functions.config().service_url.app) // 테스트 하려는 기본 주소
            .post('/personal') // 주소의 엔드포인트
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
                expect(element.text)
                    .to
                    .be
                    .a('string'); // 응답 결과의 내용이 문자열 타입인가
                expect(element.text)
                    .to
                    .include("컴공봇 채널 추가부터"); // 응답 결과가 작성한 텍스트 내용을 포함하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    it(
        'responds isFriend is true but auth fail',
        done => { // 채널은 추가되었으나 프로필 인증이 안되어있을 때
            const userRequest = {
                user: {
                    "properties": {
                        "plusfriendUserKey": functions
                            .config()
                            .service_key
                            .myKey,
                        "isFriend": true
                    }
                }
            };
            request(functions.config().service_url.app)
                .post('/personal')
                .set('Accept', 'application/json')
                .type('application/json')
                .send({userRequest})
                .expect(201)
                .then(res => {
                    const element = res
                        .body
                        .template
                        .outputs[0]
                        .itemCard;
                    // console.log(element);
                    expect(element.head.title)
                        .to
                        .be
                        .a('string');
                    expect(element.head.title)
                        .to
                        .include('누락된 설정이'); // 응답 블록의 제목 내용이 작성한 텍스트 내용을 포함하는가
                    expect(element.text)
                        .to
                        .be
                        .a('string');
                    expect(element.title)
                        .to
                        .equal('컴공봇 이용을 위해 이메일 인증과 학년/학번 입력은 필수 입니다.'); // 응답 블록의 설명 내용이 작성한 텍스트 내용과 완전 일치하는가

                    const elementItems = element.itemList;
                    const title = ['이메일', '학년/학번'];
                    expect(Object.keys(elementItems).length)
                        .to
                        .equal(title.length); // 응답 블록의 본문 사이즈가 지정한 배열 사이즈와 동일한가
                    for (let index = 0; index < elementItems.length; index++) {
                        const itemTitle = elementItems[index].title;
                        const itemDescription = elementItems[index].description;

                        expect(itemTitle)
                            .to
                            .equal(title[index]); // 응답 블록의 본문 목차 내용이 지정한 배열 내용과 완전 일치하는가
                        expect(itemDescription)
                            .to
                            .include('미설정'); // 응답 블록의 본문 내용이 작성한 텍스트 내용을 포함하는가
                    }

                    const elementQuick = res
                        .body
                        .template
                        .quickReplies[0];
                    // console.log(element);
                    expect(elementQuick.messageText)
                        .to
                        .equal('이메일 인증할게'); // 응답 블록의 바로가기 요청문 내용이 작성한 텍스트 내용과 완전 일치하는가
                    expect(elementQuick.action)
                        .to
                        .equal('block'); // 응답 블록의 바로가기 구조가 블록 구조 인가
                    expect(elementQuick.label)
                        .to
                        .equal('이메일 인증'); // 응답 블록의 바로가기 버튼명이 작성한 텍스트 내용과 완전 일치하는가
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                });
        }
    );

    it('responds not input credits', done => { // 프로필 DB에 학점 데이터가 없을 때
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .myKey,
                    "isFriend": true
                }
            }
        };
        request(functions.config().service_url.app)
            .post('/personal')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .itemCard;
                // console.log(element);
                expect(element.head.title)
                    .to
                    .be
                    .a('string'); // 응답 블록의 제목이 문자열 타입인가
                expect(element.head.title)
                    .to
                    .include('누락된 설정이'); // 응답 블록의 제목 내용이 작성한 텍스트 내용을 포함하는가
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.title)
                    .to
                    .equal('학과 개인 서비스는 학점 입력이 완료되어야 이용이 가능해집니다.'); // 응답 블록의 본문 내용이 작성한 텍스트과 완전일치 하는가

                const elementItems = element.itemList;
                const title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
                expect(Object.keys(elementItems).length)
                    .to
                    .equal(title.length); // 응답 블록의 본문 사이즈가 지정한 배열 사이즈와 동일한가
                for (let index = 0; index < elementItems.length; index++) {
                    const itemTitle = elementItems[index].title;
                    const itemDescription = elementItems[index].description;

                    expect(itemTitle)
                        .to
                        .equal(title[index]); // 응답 블록의 본문 목차 내용이 지정한 배열 내용과 완전 일치하는가
                    expect(itemDescription)
                        .to
                        .include('미설정'); // 응답 블록의 본문 내용이 작성한 텍스트 내용을 포함하는가
                }

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(element);
                expect(elementQuick.messageText)
                    .to
                    .equal('학점 입력할게'); // 응답 블록의 바로가기 요청문 내용이 작성한 텍스트 내용과 완전 일치하는가
                expect(elementQuick.action)
                    .to
                    .equal('block'); // 응답 블록의 바로가기 구조가 블록 구조 인가
                expect(elementQuick.label)
                    .to
                    .equal('학점 입력'); // 응답 블록의 바로가기 버튼명이 작성한 텍스트 내용과 완전 일치하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    it('responds all success', done => { // 프로필과 학점 입력까지 완료되어있을 때
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .myKey,
                    "isFriend": true
                }
            }
        };
        request(functions.config().service_url.app)
            .post('/personal')
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
                expect(element.text)
                    .to
                    .be
                    .a('string'); // 응답 블록의 본문이 문자열 타입인가
                expect(element.text)
                    .to
                    .include('원하시는 메뉴를 선택'); // 응답 블록의 본문이 작성한 텍스트 내용을 포함하는가

                const elementQuick = res.body.template.quickReplies;
                // console.log(element);
                const array = ['학점 조회', '졸업학점 계산', '졸업이수 조건 확인'];
                expect(elementQuick)
                    .to
                    .have
                    .lengthOf(array.length); // 응답 블록의 바로가기 개수가 지정한 배열 사이즈 만큼인가
                for (let index = 0; index < elementQuick.length; index++) {
                    expect(elementQuick[index].action)
                        .to
                        .equal('block'); // 응답 블록의 바로가기가 블록 타입인가
                    expect(elementQuick[index].label)
                        .to
                        .include(array[index]); // 응답 블록의 바로가기 버튼명이 지정한 배열 내용을 포함하는가
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});