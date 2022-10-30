const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /personal/service', () => {
    /* 테스트 단위 : 학점 조회 바로가기를 눌렀을 때 */
    it('responds check credits', done => {
        /* 테스트 사용자의 채널추가, 프로필 정보 명시 */
        /* 또한, 테스트 사용자의 요청 발화문도 추가 */
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
            utterance: "나의 누적 학점을 알려줘"
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
                /* 응답 결과 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');

                const headTitle = element.head.title;
                const elementTitle = element.title;
                expect(headTitle)
                    .to
                    .be
                    .a('string');
                expect(headTitle)
                    .to
                    .include('누적 학점 조회');
                expect(elementTitle)
                    .to
                    .be
                    .a('string');
                expect(elementTitle)
                    .to
                    .equal('학점은 설정을 통해 언제든지 수정이 가능합니다.');

                const elementItems = element.itemList;
                const title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
                /* 본문 내용 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                for (let index = 0; index < elementItems.length; index++) {
                    const itemTitle = elementItems[index].title;
                    const itemDescription = elementItems[index].description;
                    expect(itemTitle)
                        .to
                        .equal(title[index]);
                    expect(itemDescription)
                        .to
                        .be
                        .a('number');
                }

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .include('뒤로 돌아갈래');
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

    /* 테스트 단위 : 졸업학점 계산 바로가기를 눌렀을 때 */
    it('responds check graduateCredits', done => {
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
                /* 응답 결과 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');

                const headTitle = element.head.title;
                const elementTitle = element.title;
                const elementDescription = element.description;
                expect(headTitle)
                    .to
                    .be
                    .a('string');
                expect(headTitle)
                    .to
                    .include('졸업까지 남은 학점 계산');
                expect(elementTitle)
                    .to
                    .be
                    .a('string');
                expect(elementTitle)
                    .to
                    .equal('[남은 학점/전체 학점]');
                expect(elementDescription)
                    .to
                    .be
                    .a('string');
                expect(elementDescription)
                    .to
                    .equal('계산은 컴공봇에 입력하신 학점을 토대로 계산됩니다.');

                const elementItems = element.itemList;
                const title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
                /* 본문 내용 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                for (let index = 0; index < elementItems.length; index++) {
                    const itemTitle = elementItems[index].title;
                    const itemDescription = elementItems[index].description;
                    expect(itemTitle)
                        .to
                        .equal(title[index]);
                    expect(itemDescription)
                        .to
                        .be
                        .a('string');
                    expect(itemDescription)
                        .to
                        .include('/');
                    expect(itemDescription)
                        .to
                        .not
                        .include('-');
                }

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .include('뒤로 돌아갈래');
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

    /* 테스트 단위 : 졸업이수 조건 확인 바로가기를 눌렀을 때 */
    it('responds check graduationCompletionCondition', done => {
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
                /* 공학/일반인증 사용자 구분지어 테스트 시나리오 작성 */
                if (elements.length > 2) {
                    for (let index = 0; index < elements.length; index++) {
                        /* 최저이수학점과 이수체계도 이미지를 나누어 테스트 진행 */
                        if (index === 0) {
                            const element = elements[index].itemCard;
                            /* 응답결과 구조가 지정한 데이터 타입 내용인지를 테스트 */
                            expect(element)
                                .to
                                .be
                                .an('object');

                            const headTitle = element.head.title;
                            const elementTitle = element.title;
                            expect(headTitle)
                                .to
                                .be
                                .a('string');
                            expect(headTitle)
                                .to
                                .include('최저이수요구 학점표');
                            expect(elementTitle)
                                .to
                                .be
                                .a('string');
                            expect(elementTitle)
                                .to
                                .include('공학인증 최저이수요구 학점표 입니다.');

                            const elementItems = element.itemList;
                            const title = [
                                "전공필수",
                                "전공선택",
                                "교양필수",
                                "교양선택",
                                "총 학점",
                                "채플 횟수"
                            ];
                            /* 본문 내용 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                            for (let index = 0; index < elementItems.length; index++) {
                                const itemTitle = elementItems[index].title;
                                const itemDescription = elementItems[index].description;
                                // console.log(itemTitle, itemDescription);
                                expect(itemTitle)
                                    .to
                                    .equal(title[index]);
                                expect(itemDescription)
                                    .to
                                    .be
                                    .a('number');
                            }
                        } else {
                            const element = elements[index].simpleImage;
                            // console.log(element);
                            /* 이미지 응답 결과가 지정한 데이터 타입인지를 테스트 */
                            expect(element)
                                .to
                                .be
                                .an('object');
                            expect(typeof element.imageUrl)
                                .to
                                .be
                                .a('string');
                            expect(typeof element.altText)
                                .to
                                .be
                                .a('string');
                        }
                    }
                } else {
                    for (let index = 0; index < elements.length; index++) {
                        const element = elements[index].itemCard;
                        /* 응답 결과 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                        expect(element)
                                .to
                                .be
                                .an('object');
                            const headTitle = element.head.title;
                            const elementTitle = element.title;
                            expect(headTitle)
                                .to
                                .be
                                .a('string');
                            expect(headTitle)
                                .to
                                .include('최저이수요구 학점표');
                            expect(elementTitle)
                                .to
                                .be
                                .a('string');
                        if(index === 0) {
                            expect(elementTitle)
                                .to
                                .include('일반인증 최저이수요구 학점표 입니다.');

                            const elementItems = element.itemList;
                            const title = [
                                "전공필수",
                                "전공선택",
                                "교양필수",
                                "교양선택",
                                "총 학점",
                                "채플 횟수"
                            ];
                            /* 본문 내용 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                            for (let index = 0; index < elementItems.length; index++) {
                                const itemTitle = elementItems[index].title;
                                const itemDescription = elementItems[index].description;
                                // console.log(itemTitle, itemDescription);
                                expect(itemTitle)
                                    .to
                                    .equal(title[index]);
                                expect(itemDescription)
                                    .to
                                    .be
                                    .a('number');
                            }
                        } else {
                            expect(elementTitle)
                                .to
                                .include('전공 유형별 최저이수요구 학점표 입니다.');

                            const elementItems = element.itemList;
                            const title = [
                                "전공심화",
                                "부전공",
                                "복수전공"
                            ];
                            /* 본문 내용 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                            for (let index = 0; index < elementItems.length; index++) {
                                const itemTitle = elementItems[index].title;
                                const itemDescription = elementItems[index].description;
                                // console.log(itemTitle, itemDescription);
                                expect(itemTitle)
                                    .to
                                    .equal(title[index]);
                                expect(itemDescription)
                                    .to
                                    .be
                                    .a('number');
                            }
                        }
                    }
                }

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .include('뒤로 돌아갈래')
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