const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /personal/service', () => { // 테스트 수트
    it('responds check credits', done => { // 테스트 단위 : 학점 조회를 눌렀을 때
        const userRequest = { // 기본 사용자 정보 시나리오와 요청 발화문
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID, // 사용자 카카오 채널 아이디
                    "isFriend": true // 채널 추가 상태
                }
            },
            utterance: "나의 누적 학점을 알려줘"
        };
        request(functions.config().test_url.app) // 테스트 하려는 기본 주소
            .post('/personal/service') // 주소의 엔드포인트
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest}) // body 데이터 전송
            .expect(201) // 응답 상태코드
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .itemCard;
                // console.log(element);
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 결과가 오브젝트 타입인가
                const headTitle = element.head.title;
                const elementTitle = element.title;
                expect(headTitle)
                    .to
                    .be
                    .a('string'); // 응답 블록의 헤더 제목이 문자열 타입인가
                expect(headTitle)
                    .to
                    .include('누적 학점 조회'); // 응답 블록희 헤더 제목 내용이 작성한 텍스트 내용을 포함하는가
                expect(elementTitle)
                    .to
                    .be
                    .a('string'); // 응답 블록의 설명 제목이 문자열 타입인가
                expect(elementTitle)
                    .to
                    .equal('학점은 설정을 통해 언제든지 수정이 가능합니다.'); // 응답 블록의 설명 제목이 작성한 텍스트 내용과 완전 일치하는가

                const elementItems = element.itemList;
                const title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
                for (let index = 0; index < elementItems.length; index++) {
                    const itemTitle = elementItems[index].title;
                    const itemDescription = elementItems[index].description;
                    expect(itemTitle)
                        .to
                        .equal(title[index]); // 응답 블록의 본문 목차 내용이 지정한 배열의 내용과 완전 일치하는가
                    expect(itemDescription)
                        .to
                        .be
                        .a('number'); // 응답 블록의 본문 내용 값이 숫자형 타입인가
                }

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .include('뒤로 돌아갈래'); // 응답 블록의 바로가기 요청문 내용이 작성한 텍스트 내용을 포함하는가
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

    it('responds check graduateCredits', done => { // 테스트 단위 : 졸업학점 계산을 눌렀을 때
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
            utterance: "졸업까지 남은 학점을 계산해줘"
        };
        request(functions.config().test_url.app)
            .post('/personal/service')
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
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 결과가 오브젝트 타입인가
                const headTitle = element.head.title;
                const elementTitle = element.title;
                const elementDescription = element.description;
                expect(headTitle)
                    .to
                    .be
                    .a('string'); // 응답 블록의 헤더 제목이 문자열 타입인가
                expect(headTitle)
                    .to
                    .include('졸업까지 남은 학점 계산'); // 응답 블록의 헤더 제목이 작성한 텍스트 내용을 포함하는가
                expect(elementTitle)
                    .to
                    .be
                    .a('string'); // 응답 블록의 설명 제목이 문자열 타입인가
                expect(elementTitle)
                    .to
                    .equal('[남은 학점/전체 학점]'); // 응답 블록의 설명 제목이 작성한 텍스트 내용과 완전일치 하는가
                expect(elementDescription)
                    .to
                    .be
                    .a('string'); // 응답 블록의 설명문이 문자열 타입인가
                expect(elementDescription)
                    .to
                    .equal('계산은 컴공봇에 입력하신 학점을 토대로 계산됩니다.'); // 응답 블록의 설명문이 작성한 텍스트 내용을 포함하는가

                const elementItems = element.itemList;
                const title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
                for (let index = 0; index < elementItems.length; index++) {
                    const itemTitle = elementItems[index].title;
                    const itemDescription = elementItems[index].description;
                    expect(itemTitle)
                        .to
                        .equal(title[index]); // 응답 블록의 본문 목차가 지정한 배열 내용과 완전일치 하는가
                    expect(itemDescription)
                        .to
                        .be
                        .a('string'); // 응답 블록의 본문 내용이 문자열 타입인가
                    expect(itemDescription)
                        .to
                        .include('/'); // 응답 블록의 본문 내용에 작성한 텍스트가 포함되지 않았는가
                    expect(itemDescription)
                        .to
                        .not
                        .include('-'); // 응답 블록의 본문 내용에 작성한 텍스트가 포함되지 않았는가
                }

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .include('뒤로 돌아갈래'); // 응답 블록의 바로가기 요청문 내용이 작성한 텍스트 내용을 포함하는가
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

    it(
        'responds check graduationCompletionCondition',
        done => { // 테스트 단위 : 본인 학번의 졸업이수 조건을 조회할 때
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
                utterance: "나의 졸업조건을 알려줘"
            };
            request(functions.config().test_url.app)
                .post('/personal/service')
                .set('Accept', 'application/json')
                .type('application/json')
                .send({userRequest})
                .expect(201)
                .then(res => {
                    const elements = res.body.template.outputs;
                    // console.log(elements, elements.length);
                    /* 사용자가 공학인증 일 때 테스트 시나리오 */
                    if (elements.length > 1) {
                        for (let index = 0; index < elements.length; index++) {
                            if (index === 0) {
                                const element = elements[index].itemCard;
                                expect(element)
                                    .to
                                    .be
                                    .an('object'); // 응답 결과가 오브젝트 타입인가
                                const headTitle = element.head.title;
                                const elementTitle = element.title;
                                expect(headTitle)
                                    .to
                                    .be
                                    .a('string'); // 응답 블록의 헤더 제목이 문자열 타입인가
                                expect(headTitle)
                                    .to
                                    .include('최저이수요구 학점표'); // 응답 블록의 헤더 제목이 작성한 텍스트 내용을 포함하는가
                                expect(elementTitle)
                                    .to
                                    .be
                                    .a('string'); // 응답 블록의 설명 제목이 문자열 타입인가
                                expect(elementTitle)
                                    .to
                                    .include('공학인증 최저이수요구 학점표 입니다.'); // 응답 블록의 설명 제목이 작성한 텍스트 내용을 포함하는가

                                const elementItems = element.itemList;
                                const title = [
                                    "전공필수",
                                    "전공선택",
                                    "교양필수",
                                    "교양선택",
                                    "총 학점",
                                    "채플 횟수"
                                ];
                                for (let index = 0; index < elementItems.length; index++) {
                                    const itemTitle = elementItems[index].title;
                                    const itemDescription = elementItems[index].description;
                                    // console.log(itemTitle, itemDescription);
                                    expect(itemTitle)
                                        .to
                                        .equal(title[index]); // 응답 블록의 본문 목차가 지정한 배열 내용과 완전일치 하는가
                                    expect(itemDescription)
                                        .to
                                        .be
                                        .a('number'); // 응답 블록의 본문이 숫자형 타입인가
                                }
                            } else {
                                const element = elements[index].simpleImage;
                                // console.log(element);
                                expect(element)
                                    .to
                                    .be
                                    .an('object'); // 응답 블록의 오브젝트 타입인가
                                expect(typeof element.imageUrl)
                                    .to
                                    .be
                                    .a('string'); // 응답 블록의 이미지 주소가 문자열 타입인가
                                expect(typeof element.altText)
                                    .to
                                    .be
                                    .a('string'); // 응답 블록의 이미지 설명문이 문자열 타입인가
                            }
                        }
                    } else {
                        /* 사용자가 일반인증 일 때 테스트 시나리오 */
                        for (let index = 0; index < elements.length; index++) {
                            const element = elements[index].itemCard;
                            expect(element)
                                .to
                                .be
                                .an('object'); // 응답 결과가 오브젝트 타입인가
                            const headTitle = element.head.title;
                            const elementTitle = element.title;
                            expect(headTitle)
                                .to
                                .be
                                .a('string'); // 응답 블록의 헤더 제목이 문자열 타입인가
                            expect(headTitle)
                                .to
                                .include('최저이수요구 학점표'); // 응답 블록의 헤더 제목이 작성한 텍스트 내용을 포함하는가
                            expect(elementTitle)
                                .to
                                .be
                                .a('string'); // 응답 블록의 설명 제목이 문자열 타입인가
                            expect(elementTitle)
                                .to
                                .include('일반인증 최저이수요구 학점표 입니다.'); // 응답 블록의 설명 제목이 작성한 텍스트 내용을 포함하는가

                            const elementItems = element.itemList;
                            const title = [
                                "전공필수",
                                "전공선택",
                                "교양필수",
                                "교양선택",
                                "총 학점",
                                "채플 횟수"
                            ];
                            for (let index = 0; index < elementItems.length; index++) {
                                const itemTitle = elementItems[index].title;
                                const itemDescription = elementItems[index].description;
                                // console.log(itemTitle, itemDescription);
                                expect(itemTitle)
                                    .to
                                    .equal(title[index]); // 응답 블록의 본문 목차가 지정한 배열 내용과 완전일치 하는가
                                expect(itemDescription)
                                    .to
                                    .be
                                    .a('number'); // 응답 블록의 본문이 숫자형 타입인가
                            }
                        }
                    }

                    const elementQuick = res
                        .body
                        .template
                        .quickReplies[0];
                    // console.log(elementQuick);
                    expect(elementQuick.messageText)
                        .to
                        .include('뒤로 돌아갈래'); // 응답 블록의 바로가기 요청문 내용이 작성한 텍스트 내용을 포함하는가
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
        }
    );
});