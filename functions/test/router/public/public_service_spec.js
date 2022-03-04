const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /public/public_service', () => {
    it('responds checkOut1', done => { // 응답 텍스트 값 확인
        const userRequest = {
            utterance: "공지사항 게시판을 조회해줘" // 사용자 요.청 발화문
        };

        request(functions.config().service_url.app)
            .post('/public/public_service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                // console.log(res.body.template.outputs[0].listCard);  응답 리스트 뷰 구조
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .listCard;
                // console.log(typeof element);
                expect(element)
                    .to
                    .be
                    .an('object');

                const headerString = element.header.title; // 리스트 뷰 상단 문자열
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string');
                expect(headerString)
                    .to
                    .equal('학과 공지사항');

                const items = element.items; // 리스트 뷰 아이템
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

                const button = element.buttons[0]; // 리스트 뷰 하단 버튼
                // console.log(button.label);
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

                const backElement = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(backElement);
                expect(backElement.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
                expect(backElement.action)
                    .to
                    .equal('block');
                expect(backElement.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds checkOut2', done => {
        const userRequest = {
            utterance: "새소식 게시판을 조회해줘"
        };

        request(functions.config().service_url.app)
            .post('/public/public_service')
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
                // console.log(typeof element);
                expect(element)
                    .to
                    .be
                    .an('object');

                const headerString = element.header.title; // 리스트 뷰 상단 문자열
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string');
                expect(headerString)
                    .to
                    .equal('학과 새소식');

                const items = element.items; // 리스트 뷰 아이템
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

                const button = element.buttons[0]; // 리스트 뷰 하단 버튼
                // console.log(button.label);
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

                const backElement = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(backElement);
                expect(backElement.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
                expect(backElement.action)
                    .to
                    .equal('block');
                expect(backElement.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds checkOut3', done => {
        const userRequest = {
            utterance: "자유게시판을 조회해줘"
        };

        request(functions.config().service_url.app)
            .post('/public/public_service')
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
                // console.log(typeof element);
                expect(element)
                    .to
                    .be
                    .an('object');

                const headerString = element.header.title; // 리스트 뷰 상단 문자열
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string');
                expect(headerString)
                    .to
                    .equal('학과 자유게시판');

                const items = element.items; // 리스트 뷰 아이템
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

                const button = element.buttons[0]; // 리스트 뷰 하단 버튼
                // console.log(button.label);
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

                const backElement = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(backElement);
                expect(backElement.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
                expect(backElement.action)
                    .to
                    .equal('block');
                expect(backElement.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds checkOut4', done => {
        const userRequest = {
            utterance: "외부IT행사 및 교육 게시판을 조회해줘"
        };

        request(functions.config().service_url.app)
            .post('/public/public_service')
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
                // console.log(typeof element);
                expect(element)
                    .to
                    .be
                    .an('object');

                const headerString = element.header.title; // 리스트 뷰 상단 문자열
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string');
                expect(headerString)
                    .to
                    .equal('외부IT행사 및 교육');

                const items = element.items; // 리스트 뷰 아이템
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

                const button = element.buttons[0]; // 리스트 뷰 하단 버튼
                // console.log(button.label);
                expect(button.label)
                    .to
                    .equal('외부IT행사&교육 페이지');
                expect(button.action)
                    .to
                    .equal('webLink');
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string');

                const backElement = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(backElement);
                expect(backElement.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
                expect(backElement.action)
                    .to
                    .equal('block');
                expect(backElement.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds checkOut5', done => {
        const userRequest = {
            utterance: "공학인증자료실 게시판을 조회해줘"
        };

        request(functions.config().service_url.app)
            .post('/public/public_service')
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
                // console.log(typeof element);
                expect(element)
                    .to
                    .be
                    .an('object');

                const headerString = element.header.title; // 리스트 뷰 상단 문자열
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string');
                expect(headerString)
                    .to
                    .equal('학과 공학인증자료실');

                const items = element.items; // 리스트 뷰 아이템
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

                const button = element.buttons[0]; // 리스트 뷰 하단 버튼
                // console.log(button.label);
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

                const backElement = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(backElement);
                expect(backElement.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
                expect(backElement.action)
                    .to
                    .equal('block');
                expect(backElement.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds checkOut6', done => {
        const userRequest = {
            utterance: "교과과정을 조회해줘"
        };

        request(functions.config().service_url.app)
            .post('/public/public_service')
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
                expect(element.imageUrl)
                    .to
                    .include('png');
                expect(element.altText)
                    .to
                    .include('교과과정');

                const backElement = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(backElement);
                expect(backElement.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
                expect(backElement.action)
                    .to
                    .equal('block');
                expect(backElement.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds checkOut7', done => {
        const userRequest = {
            utterance: "올해 이수체계도를 조회해줘"
        };

        request(functions.config().service_url.app)
            .post('/public/public_service')
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
                expect(element.imageUrl)
                    .to
                    .include('png');
                expect(element.altText)
                    .to
                    .include('올해 이수체계도');

                const backElement = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(backElement);
                expect(backElement.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
                expect(backElement.action)
                    .to
                    .equal('block');
                expect(backElement.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds checkOut8', done => {
        const userRequest = {
            utterance: "교수진소개 게시판을 조회해줘"
        };

        request(functions.config().service_url.app)
            .post('/public/public_service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .carousel;
                // console.log(element);
                expect(element.type)
                    .to
                    .equal('basicCard');

                const items = element.items;
                // console.log(items.length);
                expect(items.length)
                    .to
                    .equal(10);
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDescription = items[index].description;
                    const itemImg = items[index].thumbnail;
                    const itemBtn = items[index].buttons;
                    // console.log(itemImg.imageUrl);
                    // console.log(itemBtn[0].label);

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
                        .include('직위')
                    expect(itemDescription)
                        .to
                        .include('연락처')
                    expect(typeof itemImg.imageUrl)
                        .to
                        .be
                        .an('string');
                    expect(itemBtn[0].label)
                        .to
                        .be
                        .an('string');
                    expect(itemBtn[0].action)
                        .to
                        .equal('webLink')
                }

                const backElement = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(backElement);
                expect(backElement.messageText)
                    .to
                    .equal('뒤로 돌아갈래');
                expect(backElement.action)
                    .to
                    .equal('block');
                expect(backElement.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});