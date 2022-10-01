const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /public/service', () => {
    /* 테스트 단위 : 공지사항 바로가기를 눌렀을 때 */
    it('responds resultNotice', done => {
        /* 테스트 사용자 채널추가, 프로필 정보 명시 */
        /* 또한, 테스트 사용자 요청 발화문도 추가 */
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
            utterance: "공지사항 게시판을 조회해줘"
        };

        request(functions.config().test_url.app)
            .post('/public/service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .listCard;
                // console.log(element);
                /* 응답 결과의 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string');
                expect(headerString)
                    .to
                    .equal('학과 공지사항');

                const items = element.items;
                /* 본문 내용의 응답 결과가 지정한 개수, 데이터 타입인지를 테스트 */
                expect(items.length)
                    .to
                    .equal(5);
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDate = items[index].description;
                    const itemUrl = items[index].link;
                    expect(itemTitle)
                        .to
                        .be
                        .a('string');
                    expect(itemDate)
                        .to
                        .be
                        .a('string');
                    expect(itemUrl)
                        .to
                        .be
                        .an('object');
                }

                const button = element.buttons[0];
                // console.log(button.label);
                /* 페이지 바로가기 버튼 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(button.label)
                    .to
                    .equal('학과 공지사항 페이지');
                expect(button.action)
                    .to
                    .equal('webLink');
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string');

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
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

    /* 테스트 단위 : 새소식 바로가기를 눌렀을 때 */
    it('responds resultNotice', done => {
        /* 테스트 사용자 채널추가, 프로필 정보 명시 */
        /* 또한, 테스트 사용자 요청 발화문도 추가 */
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
            utterance: "새소식 게시판을 조회해줘"
        };

        request(functions.config().test_url.app)
            .post('/public/service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .listCard;
                // console.log(element);
                /* 응답 결과의 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string');
                expect(headerString)
                    .to
                    .equal('학과 새소식');

                const items = element.items;
                /* 본문 내용의 응답 결과가 지정한 개수, 데이터 타입인지를 테스트 */
                expect(items.length)
                    .to
                    .equal(5);
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDate = items[index].description;
                    const itemUrl = items[index].link;
                    expect(itemTitle)
                        .to
                        .be
                        .a('string');
                    expect(itemDate)
                        .to
                        .be
                        .a('string');
                    expect(itemUrl)
                        .to
                        .be
                        .an('object');
                }

                const button = element.buttons[0];
                // console.log(button.label);
                /* 페이지 바로가기 버튼 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(button.label)
                    .to
                    .equal('학과 새소식 페이지');
                expect(button.action)
                    .to
                    .equal('webLink');
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string');

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
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

    /* 테스트 단위 : 자유게시판 바로가기를 눌렀을 때 */
    it('responds resultNotice', done => {
        /* 테스트 사용자 채널추가, 프로필 정보 명시 */
        /* 또한, 테스트 사용자 요청 발화문도 추가 */
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
            utterance: "자유게시판을 조회해줘"
        };

        request(functions.config().test_url.app)
            .post('/public/service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .listCard;
                // console.log(element);
                /* 응답 결과의 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string');
                expect(headerString)
                    .to
                    .equal('학과 자유게시판');

                const items = element.items;
                /* 본문 내용의 응답 결과가 지정한 개수, 데이터 타입인지를 테스트 */
                expect(items.length)
                    .to
                    .equal(5);
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDate = items[index].description;
                    const itemUrl = items[index].link;
                    expect(itemTitle)
                        .to
                        .be
                        .a('string');
                    expect(itemDate)
                        .to
                        .be
                        .a('string');
                    expect(itemUrl)
                        .to
                        .be
                        .an('object');
                }

                const button = element.buttons[0];
                // console.log(button.label);
                /* 페이지 바로가기 버튼 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(button.label)
                    .to
                    .equal('학과 자유게시판 페이지');
                expect(button.action)
                    .to
                    .equal('webLink');
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string');

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
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

    /* 테스트 단위 : 외부IT행사 및 교육 게시판 바로가기를 눌렀을 때 */
    it('responds resultNotice', done => {
        /* 테스트 사용자 채널추가, 프로필 정보 명시 */
        /* 또한, 테스트 사용자 요청 발화문도 추가 */
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
            utterance: "외부IT행사 및 교육 게시판을 조회해줘"
        };

        request(functions.config().test_url.app)
            .post('/public/service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .listCard;
                // console.log(element);
                /* 응답 결과의 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string');
                expect(headerString)
                    .to
                    .equal('외부IT행사 및 교육 게시판');

                const items = element.items;
                /* 본문 내용의 응답 결과가 지정한 개수, 데이터 타입인지를 테스트 */
                expect(items.length)
                    .to
                    .equal(5);
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDate = items[index].description;
                    const itemUrl = items[index].link;
                    expect(itemTitle)
                        .to
                        .be
                        .a('string');
                    expect(itemDate)
                        .to
                        .be
                        .a('string');
                    expect(itemUrl)
                        .to
                        .be
                        .an('object');
                }

                const button = element.buttons[0];
                // console.log(button.label);
                /* 페이지 바로가기 버튼 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(button.label)
                    .to
                    .equal('외부IT행사 및 교육 게시판 페이지');
                expect(button.action)
                    .to
                    .equal('webLink');
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string');

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
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

    /* 테스트 단위 : 공학인증자료실 바로가기를 눌렀을 때 */
    it('responds resultNotice', done => {
        /* 테스트 사용자 채널추가, 프로필 정보 명시 */
        /* 또한, 테스트 사용자 요청 발화문도 추가 */
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
            utterance: "공학인증자료실 게시판을 조회해줘"
        };

        request(functions.config().test_url.app)
            .post('/public/service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .listCard;
                // console.log(element);
                /* 응답 결과의 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string');
                expect(headerString)
                    .to
                    .equal('학과 공학인증자료실');

                const items = element.items;
                /* 본문 내용의 응답 결과가 지정한 개수, 데이터 타입인지를 테스트 */
                expect(items.length)
                    .to
                    .equal(5);
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDate = items[index].description;
                    const itemUrl = items[index].link;
                    expect(itemTitle)
                        .to
                        .be
                        .a('string');
                    expect(itemDate)
                        .to
                        .be
                        .a('string');
                    expect(itemUrl)
                        .to
                        .be
                        .an('object');
                }

                const button = element.buttons[0];
                // console.log(button.label);
                /* 페이지 바로가기 버튼 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(button.label)
                    .to
                    .equal('학과 공학인증자료실 페이지');
                expect(button.action)
                    .to
                    .equal('webLink');
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string');

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
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

    /* 테스트 단위 : 교과과정 바로가기를 눌렀을 때 */
    it('responds resultCurriculum', done => {
        /* 테스트 사용자 채널추가, 프로필 정보 명시 */
        /* 또한, 테스트 사용자 요청 발화문도 추가 */
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
            utterance: "교과과정을 조회해줘"
        };

        request(functions.config().test_url.app)
            .post('/public/service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleImage;
                // console.log(element);
                /* 응답 결과가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(typeof element.imageUrl)
                    .to
                    .be
                    .a('string');
                expect(element.imageUrl)
                    .to
                    .include('png');
                expect(element.altText)
                    .to
                    .equal('교과과정');

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
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

    /* 테스트 단위 : 올해 이수체계도 바로가기를 눌렀을 때 */
    it('responds resultCompletionSystem', done => {
        /* 테스트 사용자 채널추가, 프로필 정보 명시 */
        /* 또한, 테스트 사용자 요청 발화문도 추가 */
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
            utterance: "올해 이수체계도를 조회해줘"
        };

        request(functions.config().test_url.app)
            .post('/public/service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const year = new Date().getFullYear();
                const imgAlt = year + "년도 교과과정";
                const elementLength = res.body.template.outputs.length;
                // console.log(elementLength);
                /* 응답 횟수 별로 테스트 시행 */
                for (let index = 0; index < elementLength; index++) {
                    const element = res
                        .body
                        .template
                        .outputs[index]
                        .simpleImage;
                    // console.log(element);
                    /* 응답 결과가 지정한 데이터 타입, 내용인지를 테스트 */
                    expect(element)
                        .to
                        .be
                        .an('object');
                    expect(typeof element.imageUrl)
                        .to
                        .be
                        .a('string');
                    expect(element.imageUrl)
                        .to
                        .include('jpg');
                    expect(element.altText)
                        .to
                        .equal(imgAlt);
                }

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                /* 뒤로가기 응답 결과가 지정한 내용, 데이터 타입인지를 테스트 */
                expect(elementQuick.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
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

    /* 테스트 단위 : 교수진소개 바로가기를 눌렀을 때 */
    it('responds resultFacultyIntroduction', done => {
        /* 테스트 사용자 채널추가, 프로필 정보 명시 */
        /* 또한, 테스트 사용자 요청 발화문도 추가 */
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
            utterance: "교수진소개 게시판을 조회해줘"
        };

        request(functions.config().test_url.app)
            .post('/public/service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const elementLength = res.body.template.outputs.length;
                // console.log(elementLength);
                /* 응답 횟수 별로 테스트 시행 */
                for (let index = 0; index < elementLength; index++) {
                    const element = res
                        .body
                        .template
                        .outputs[index]
                        .carousel;
                    // console.log(element);
                    expect(element.type)
                        .to
                        .equal('basicCard'); // 응답 결과 구조가 지정한 데이터 타입인지를 테스트
                    const items = element.items;
                    // console.log(items.length);
                    for (let index = 0; index < items.length; index++) {
                        const itemTitle = items[index].title;
                        const itemDescription = items[index].description;
                        const itemImg = items[index].thumbnail;
                        const itemBtn = items[index].buttons;
                        // console.log(itemTitle, itemDescription, itemImg, itemBtn);
                        /* 본문 내용과 페이지 바로가기 응답 결과가 지정한 데이터 타입, 내용인지를 테스트 */
                        expect(itemTitle)
                            .to
                            .be
                            .a('string');
                        expect(itemDescription)
                            .to
                            .be
                            .a('string');
                        expect(itemDescription)
                            .to
                            .include('연락처');
                        expect(itemDescription)
                            .to
                            .include('연구실');
                        expect(typeof itemImg.imageUrl)
                            .to
                            .be
                            .a('string');
                        expect(itemBtn[0].label)
                            .to
                            .be
                            .a('string');
                        expect(itemBtn[0].action)
                            .to
                            .equal('webLink');
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
                    .equal('뒤로 돌아갈래');
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
});