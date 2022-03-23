const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /public/public_service', () => { // 테스트 수트
    it('responds resultOut', done => { // 테스트 단위(확인하고자 하는 내용을 명시)
        const userRequest = {
            utterance: "공지사항 게시판을 조회해줘" // 사용자 요청 발화문
        };

        request(functions.config().service_url.app) // 테스트 하려는 기본 주소
            .post('/public/public_service') // 주소의 엔드포인트
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest}) // body 데이터 전송
            .expect(201) // 응답 상태코드
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .listCard;
                // console.log(element);
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 결과가 오브젝트 타입인가

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string'); // 리스트 뷰 제목이 문자열 타입인가
                expect(headerString)
                    .to
                    .equal('학과 공지사항'); // 리스트 뷰 제목 내용이 작성한 텍스트 내용과 완전 일치하는가

                const items = element.items;
                expect(items.length)
                    .to
                    .equal(5); // 리스트 뷰의 본문 갯수가 지정한 값 만큼인가
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDate = items[index].description;
                    const itemUrl = items[index].link;
                    expect(itemTitle)
                        .to
                        .be
                        .a('string'); // 리스트 뷰 본문의 제목이 문자열 타입인가
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
                expect(button.label)
                    .to
                    .equal('학과 공지사항 페이지'); // 리스트 뷰 하단 버튼명이 작성한 텍스트 내용과 완전 일치하는가
                expect(button.action)
                    .to
                    .equal('webLink'); // 리스트 뷰 하단 버튼 구조가 웹 링크연결 구조인가
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string'); // 리스트 뷰 하단 버튼 링크가 문자열 타입인가

                const backElement = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(backElement);
                expect(backElement.messageText)
                    .to
                    .equal('뒤로 돌아갈래'); // 응답 블록의 바로가기 요청문 내용이 작성한 텍스트 내용과 완전 일치하는가
                expect(backElement.action)
                    .to
                    .equal('block'); // 응답 블록의 바로가기 구조가 블록 구조 인가
                expect(backElement.label)
                    .to
                    .include('뒤로가기'); // 응답 블록의 바로가기명이 작성한 텍스트 내용을 포함하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds resultOut2', done => {
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
    it('responds resultOut3', done => {
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
    it('responds resultOut4', done => {
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

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string');
                expect(headerString)
                    .to
                    .equal('외부IT행사 및 교육');

                const items = element.items;
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
    it('responds resultOut5', done => {
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
    it('responds resultOut6', done => {
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
    it('responds resultOut7', done => {
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
    it('responds resultOut8', done => {
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
                    // console.log(itemImg.imageUrl); console.log(itemBtn[0].label);

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
                        .include('직위');
                    expect(itemDescription)
                        .to
                        .include('연락처');
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