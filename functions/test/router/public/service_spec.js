const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /public/service', () => { // 테스트 수트
    it('responds resultNotice', done => { // 테스트 단위 : 공지사항 조회를 눌렀을 때
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
            utterance: "공지사항 게시판을 조회해줘" // 사용자 요청 발화문
        };

        request(functions.config().test_url.app) // 테스트 하려는 기본 주소
            .post('/public/service') // 주소의 엔드포인트
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
                    .an('object'); // 응답 블록이 오브젝트 타입인가

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string'); // 응답 블록의 헤더 제목이 문자열 타입인가
                expect(headerString)
                    .to
                    .equal('학과 공지사항'); // 응답 블록의 헤도 제목 내용이 작성한 텍스트 내용과 완전 일치하는가

                const items = element.items;
                expect(items.length)
                    .to
                    .equal(5); // 응답 블록의 본문 개수가 지정한 값 만큼인가
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDate = items[index].description;
                    const itemUrl = items[index].link;
                    expect(itemTitle)
                        .to
                        .be
                        .a('string'); // 응답 블록 본문의 게시물 제목이 문자열 타입인가
                    expect(itemDate)
                        .to
                        .be
                        .a('string'); // 응답 블록 본문의 게시물 업로드 날짜가 문자열 타입인가
                    expect(itemUrl)
                        .to
                        .be
                        .an('object'); // 응답 블록의 본문의 게시물 주소가 오브젝트 타입인가
                }

                const button = element.buttons[0];
                // console.log(button.label);
                expect(button.label)
                    .to
                    .equal('학과 공지사항 페이지'); // 응답 블록 하단 버튼명이 작성한 텍스트 내용과 완전 일치하는가
                expect(button.action)
                    .to
                    .equal('webLink'); // 응답 블록 하단 버튼 구조가 웹 링크연결 구조인가
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string'); // 응답 블록 하단 버튼 링크가 문자열 타입인가

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

    it('responds resultNewnews', done => { // 테스트 단위 : 선택한 메뉴의 응답 데이터가 출력되는가
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
            utterance: "새소식 게시판을 조회해줘" // 사용자 요청 발화문
        };

        request(functions.config().test_url.app) // 테스트 하려는 기본 주소
            .post('/public/service') // 주소의 엔드포인트
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
                // console.log(typeof element);
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 블록이 오브젝트 타입인가

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string'); // 응답 블록의 헤더 제목이 문자열 타입인가
                expect(headerString)
                    .to
                    .equal('학과 새소식'); // 응답 블록의 헤도 제목 내용이 작성한 텍스트 내용과 완전 일치하는가

                const items = element.items;
                expect(items.length)
                    .to
                    .equal(5); // 응답 블록의 본문 개수가 지정한 값 만큼인가
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDate = items[index].description;
                    const itemUrl = items[index].link;
                    expect(itemTitle)
                        .to
                        .be
                        .a('string'); // 응답 블록 본문의 게시물 제목이 문자열 타입인가
                    expect(itemDate)
                        .to
                        .be
                        .a('string'); // 응답 블록 본문의 게시물 업로드 날짜가 문자열 타입인가
                    expect(itemUrl)
                        .to
                        .be
                        .an('object'); // 응답 블록의 본문의 게시물 주소가 오브젝트 타입인가
                }

                const button = element.buttons[0];
                // console.log(button.label);
                expect(button.label)
                    .to
                    .equal('학과 새소식 페이지'); // 응답 블록 하단 버튼명이 작성한 텍스트 내용과 완전 일치하는가
                expect(button.action)
                    .to
                    .equal('webLink'); // 응답 블록 하단 버튼 구조가 웹 링크연결 구조인가
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string'); // 응답 블록 하단 버튼 링크가 문자열 타입인가

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

    it('responds resultFreeborad', done => { // 테스트 단위 : 선택한 메뉴의 응답 데이터가 출력되는가
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
            utterance: "자유게시판을 조회해줘" // 사용자 요청 발화문
        };

        request(functions.config().test_url.app) // 테스트 하려는 기본 주소
            .post('/public/service') // 주소의 엔드포인트
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
                // console.log(typeof element);
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 블록이 오브젝트 타입인가

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string'); // 응답 블록의 헤더 제목이 문자열 타입인가
                expect(headerString)
                    .to
                    .equal('학과 자유게시판'); // 응답 블록의 헤도 제목 내용이 작성한 텍스트 내용과 완전 일치하는가

                const items = element.items;
                expect(items.length)
                    .to
                    .equal(5); // 응답 블록의 본문 개수가 지정한 값 만큼인가
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDate = items[index].description;
                    const itemUrl = items[index].link;
                    expect(itemTitle)
                        .to
                        .be
                        .a('string'); // 응답 블록 본문의 게시물 제목이 문자열 타입인가
                    expect(itemDate)
                        .to
                        .be
                        .a('string'); // 응답 블록 본문의 게시물 업로드 날짜가 문자열 타입인가
                    expect(itemUrl)
                        .to
                        .be
                        .an('object'); // 응답 블록의 본문의 게시물 주소가 오브젝트 타입인가
                }

                const button = element.buttons[0];
                // console.log(button.label);
                expect(button.label)
                    .to
                    .equal('학과 자유게시판 페이지'); // 응답 블록 하단 버튼명이 작성한 텍스트 내용과 완전 일치하는가
                expect(button.action)
                    .to
                    .equal('webLink'); // 응답 블록 하단 버튼 구조가 웹 링크연결 구조인가
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string'); // 응답 블록 하단 버튼 링크가 문자열 타입인가

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

    it('responds resultEducation', done => { // 테스트 단위 : 선택한 메뉴의 응답 데이터가 출력되는가
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
            utterance: "외부IT행사 및 교육 게시판을 조회해줘" // 사용자 요청 발화문
        };

        request(functions.config().test_url.app) // 테스트 하려는 기본 주소
            .post('/public/service') // 주소의 엔드포인트
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
                // console.log(typeof element);
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 블록이 오브젝트 타입인가

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string'); // 응답 블록의 헤더 제목이 문자열 타입인가
                expect(headerString)
                    .to
                    .equal('외부IT행사 및 교육'); // 응답 블록의 헤도 제목 내용이 작성한 텍스트 내용과 완전 일치하는가

                const items = element.items;
                expect(items.length)
                    .to
                    .equal(5); // 응답 블록의 본문 개수가 지정한 값 만큼인가
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDate = items[index].description;
                    const itemUrl = items[index].link;
                    expect(itemTitle)
                        .to
                        .be
                        .a('string'); // 응답 블록 본문의 게시물 제목이 문자열 타입인가
                    expect(itemDate)
                        .to
                        .be
                        .a('string'); // 응답 블록 본문의 게시물 업로드 날짜가 문자열 타입인가
                    expect(itemUrl)
                        .to
                        .be
                        .an('object'); // 응답 블록의 본문의 게시물 주소가 오브젝트 타입인가
                }

                const button = element.buttons[0];
                // console.log(button.label);
                expect(button.label)
                    .to
                    .equal('외부IT행사&교육 페이지'); // 응답 블록 하단 버튼명이 작성한 텍스트 내용과 완전 일치하는가
                expect(button.action)
                    .to
                    .equal('webLink'); // 응답 블록 하단 버튼 구조가 웹 링크연결 구조인가
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string'); // 응답 블록 하단 버튼 링크가 문자열 타입인가

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

    it('responds resultEngineering', done => { // 테스트 단위 : 선택한 메뉴의 응답 데이터가 출력되는가
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
            utterance: "공학인증자료실 게시판을 조회해줘" // 사용자 요청 발화문
        };

        request(functions.config().test_url.app) // 테스트 하려는 기본 주소
            .post('/public/service') // 주소의 엔드포인트
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
                // console.log(typeof element);
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 블록이 오브젝트 타입인가

                const headerString = element.header.title;
                // console.log(headerString);
                expect(headerString)
                    .to
                    .be
                    .a('string'); // 응답 블록의 헤더 제목이 문자열 타입인가
                expect(headerString)
                    .to
                    .equal('학과 공학인증자료실'); // 응답 블록의 헤도 제목 내용이 작성한 텍스트 내용과 완전 일치하는가

                const items = element.items;
                expect(items.length)
                    .to
                    .equal(5); // 응답 블록의 본문 개수가 지정한 값 만큼인가
                for (let index = 0; index < items.length; index++) {
                    const itemTitle = items[index].title;
                    const itemDate = items[index].description;
                    const itemUrl = items[index].link;
                    expect(itemTitle)
                        .to
                        .be
                        .a('string'); // 응답 블록 본문의 게시물 제목이 문자열 타입인가
                    expect(itemDate)
                        .to
                        .be
                        .a('string'); // 응답 블록 본문의 게시물 업로드 날짜가 문자열 타입인가
                    expect(itemUrl)
                        .to
                        .be
                        .an('object'); // 응답 블록의 본문의 게시물 주소가 오브젝트 타입인가
                }

                const button = element.buttons[0];
                // console.log(button.label);
                expect(button.label)
                    .to
                    .equal('학과 공학인증자료실 페이지'); // 응답 블록 하단 버튼명이 작성한 텍스트 내용과 완전 일치하는가
                expect(button.action)
                    .to
                    .equal('webLink'); // 응답 블록 하단 버튼 구조가 웹 링크연결 구조인가
                expect(button.webLinkUrl)
                    .to
                    .be
                    .a('string'); // 응답 블록 하단 버튼 링크가 문자열 타입인가

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

    it('responds resultCurriculum', done => { // 테스트 단위 : 선택한 메뉴의 응답 데이터가 출력되는가
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
            utterance: "교과과정을 조회해줘" // 사용자 요청 발화문
        };

        request(functions.config().test_url.app) // 테스트 하려는 기본 주소
            .post('/public/service') // 주소의 엔드포인트
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest}) // body 데이터 전송
            .expect(201) // 응답 상태코드
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleImage;
                // console.log(element);
                expect(element)
                    .to
                    .be
                    .an('object'); // 응답 블록이 오브젝트 타입인가
                expect(typeof element.imageUrl)
                    .to
                    .be
                    .a('string'); // 응답 블록의 이미지 주소가 문자열 타입인가
                expect(element.imageUrl)
                    .to
                    .include('png'); // 응답 블록의 이미지 주소에 png 확장자가 포함되었는가
                expect(element.altText)
                    .to
                    .equal('교과과정'); // 응답 블록의 이미지 설명문이 작성한 텍스트 내용과 완전일치 하는가

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

    it('responds resultCompletionSystem', done => { // 테스트 단위 : 선택한 메뉴의 응답 데이터가 출력되는가
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
            utterance: "올해 이수체계도를 조회해줘" // 사용자 요청 발화문
        };

        request(functions.config().test_url.app) // 테스트 하려는 기본 주소
            .post('/public/service') // 주소의 엔드포인트
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest}) // body 데이터 전송
            .expect(201) // 응답 상태코드
            .then(res => {
                const year = new Date().getFullYear();
                const imgAlt = year + "년도 교과과정";
                const elementLength = res.body.template.outputs.length;
                // console.log(elementLength);
                /* 응답 횟수 별로 구조와 내용 검증*/
                for (let index = 0; index < elementLength; index++) {
                    const element = res
                        .body
                        .template
                        .outputs[index]
                        .simpleImage;
                    // console.log(element);
                    expect(element)
                        .to
                        .be
                        .an('object'); // 응답 블록이 오브젝트 타입인가
                    expect(typeof element.imageUrl)
                        .to
                        .be
                        .a('string'); // 응답 블록의 이미지 주소가 문자열 타입인가
                    expect(element.imageUrl)
                        .to
                        .include('jpg'); // 응답 블록의 이미지 주소에 jpg 확장자가 포함되었는가
                    expect(element.altText)
                        .to
                        .equal(imgAlt); // 응답 블록의 이미지 설명문이 작성한 imgAlt 내용과 완전일치 하는가
                }

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

    it('responds resultFacultyIntroduction', done => { // 테스트 단위 : 선택한 메뉴의 응답 데이터가 출력되는가
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
            utterance: "교수진소개 게시판을 조회해줘" // 사용자 요청 발화문
        };

        request(functions.config().test_url.app) // 테스트 하려는 기본 주소
            .post('/public/service') // 주소의 엔드포인트
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest}) // body 데이터 전송
            .expect(201) // 응답 상태코드
            .then(res => {
                const elementLength = res.body.template.outputs.length;
                // console.log(elementLength);
                /* 응답 횟수 별로 구조와 내용 검증*/
                for (let index = 0; index < elementLength; index++) {
                    const element = res
                        .body
                        .template
                        .outputs[index]
                        .carousel;
                    // console.log(element);
                    expect(element.type)
                        .to
                        .equal('basicCard'); // 응답 블록의 구조가 베이직 카드 구조인가
                    const items = element.items;
                    // console.log(items.length);
                    for (let index = 0; index < items.length; index++) {
                        const itemTitle = items[index].title;
                        const itemDescription = items[index].description;
                        const itemImg = items[index].thumbnail;
                        const itemBtn = items[index].buttons;
                        // console.log(itemTitle, itemDescription, itemImg, itemBtn);
                        expect(itemTitle)
                            .to
                            .be
                            .a('string'); // 응답 블록 본문의 게시물 제목이 문자열 타입인가
                        expect(itemDescription)
                            .to
                            .be
                            .a('string'); // 응답 블록 본문의 게시물 설명이 문자열 타입인가
                        expect(itemDescription)
                            .to
                            .include('연락처'); // 응답 블록의 설명이 작성한 텍스트 내용을 포함하는가
                        expect(itemDescription)
                            .to
                            .include('연구실'); // 응답 블록의 설명이 작성한 텍스트 내용을 포함하는가
                        expect(typeof itemImg.imageUrl)
                            .to
                            .be
                            .a('string'); // 응답 블록 하단 버튼 링크가 문자열 타입인가
                        expect(itemBtn[0].label)
                            .to
                            .be
                            .a('string'); // 응답 블록 하단 버튼명이 문자열 타입인가
                        expect(itemBtn[0].action)
                            .to
                            .equal('webLink'); // 응답 블록 하단 버튼 구조가 웹 링크연결 구조인가
                    }
                }

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