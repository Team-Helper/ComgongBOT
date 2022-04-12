const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting', () => { // 테스트 수트
    it('responds about isFriend is false', done => { // 테스트 단위 : 채널 추가가 안되어있을 때
        const userRequest = { // 기본 사용자 정보 시나리오
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id", // 사용자 카카오 채널 아이디
                    "isFriend": undefined // 채널 추가 상태
                }
            }
        };
        request(functions.config().service_url.app) // 테스트 하려는 기본 주소
            .post('/setting') // 주소의 엔드포인트
            .set({
                key: functions
                    .config()
                    .service_url
                    .setting_key
            })
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
                    .include("컴공봇 채널 추가부터"); // 응답 결과가 작성한 텍스트 내용을 포함하는가
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });

    it(
        'responds isFriend is true and auth fail',
        done => { // 채널은 추가되었으나 프로필 인증이 안되어있을 때
            const userRequest = {
                user: {
                    "properties": {
                        "plusfriendUserKey": "some-id",
                        "isFriend": true
                    }
                }
            };
            request(functions.config().service_url.app)
                .post('/setting')
                .set({
                    key: functions
                        .config()
                        .service_url
                        .setting_key
                })
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
                        .a('string'); // 아이템 카드 뷰의 제목이 문자열 타입인가
                    expect(element.head.title)
                        .to
                        .include('누락된 설정이'); // 아이템 카드 뷰의 제목 내용이 작성한 텍스트 내용을 포함하는가
                    expect(element.title)
                        .to
                        .equal('컴공봇 이용을 위해 이메일 인증과 학년/학번 입력은 필수 입니다.'); // 아이템 카드 뷰의 설명 내용이 작성한 텍스트 내용과 완전 일치하는가

                    const elementItems = element.itemList;
                    const title = ['이메일', '학년/학번'];
                    for (let index = 0; index < elementItems.length; index++) {
                        const itemTitle = elementItems[index].title;
                        const itemDescription = elementItems[index].description;
                        expect(itemTitle)
                            .to
                            .equal(title[index]); // 아이템 카드 뷰의 본문 구성이 지정한 배열 내용과 완전 일치하는가
                        expect(itemDescription)
                            .to
                            .include('미설정'); // 아이템 카드 뷰의 본문 내용이 작성한 텍스트 내용을 포함하는가
                    }

                    const elementQuick = res
                        .body
                        .template
                        .quickReplies[0];
                    // console.log(elementQuick);
                    expect(elementQuick.messageText)
                        .to
                        .equal('이메일 인증할게'); // 응답 블록의 바로가기 요청문 내용이 작성한 텍스트 내용과 완전 일치하는가
                    expect(elementQuick.label)
                        .to
                        .equal('이메일 인증'); // 응답 블록의 바로가기 버튼명이 작성한 텍스트 내용과 완전 일치하는가
                    done();
                })
                .catch(err => {
                    console.error("Error >>", err);
                    done(err);
                })
            }
    );

    it('responds not input credits', done => { // 프로필 인증은 되었으나 학점 입력이 이루어지지 않았을 때
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            }
        };
        request(functions.config().service_url.app)
            .post('/setting')
            .set({
                key: functions
                    .config()
                    .service_url
                    .setting_key
            })
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

                expect(element.imageTitle.title)
                    .to
                    .equal('프로필 설정'); // 아이템 카드 뷰의 이미지 제목 내용이 작성한 텍스트 내용과 완전 일치하는가
                expect(element.imageTitle.imageUrl)
                    .to
                    .include('png'); // 아이템 카드 뷰 이미지 주소에 png 명칭이 포함하는가
                const itemLength = element.itemList.length;
                // console.log(itemLength);
                const items = ["이메일", "학년/학번", "학적상태", "공학인증상태", "학점입력"];
                const type = ['string', 'string', 'string', 'string', 'string'];
                for (let index = 0; index < itemLength; index++) {
                    // console.log(element.itemList[index].description)
                    expect(element.itemList[index].title)
                        .to
                        .equal(items[index]); // 아이템 카드 뷰 본문의 제목이 지정한 배열의 내용과 완전 일치하는가
                    expect(element.itemList[index].description)
                        .to
                        .be
                        .a(type[index]); // 아이템 카드 뷰 본문의 내용이 문자열 타입인가
                }

                const elementQuick = res.body.template.quickReplies;
                // console.log(element);
                const array = ['학점 입력', '학년 변경', '학번 변경', '학적상태 변경', '공학인증상태 변경', '설정 초기화']
                for (let index = 0; index < elementQuick.length; index++) {
                    expect(elementQuick[index].label)
                        .to
                        .equal(array[index]); // 응답 블록의 바로가기 버튼명이 지정한 배열의 내용과 완전 일치하는가
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });

    it('responds auth success', done => { // 프로필 그리고 학점 인증까지 되었을 떄
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            }
        };
        request(functions.config().service_url.app)
            .post('/setting')
            .set({
                key: functions
                    .config()
                    .service_url
                    .setting_key
            })
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

                expect(element.imageTitle.title)
                    .to
                    .equal('프로필 설정');
                expect(element.imageTitle.imageUrl)
                    .to
                    .include('png');
                const itemLength = element.itemList.length;
                // console.log(itemLength);
                const items = ["이메일", "학년/학번", "학적상태", "공학인증상태", "학점입력"];
                const type = ['string', 'string', 'string', 'string', 'string'];
                for (let index = 0; index < itemLength; index++) {
                    // console.log(element.itemList[index].description)
                    expect(element.itemList[index].title)
                        .to
                        .equal(items[index]);
                    expect(element.itemList[index].description)
                        .to
                        .be
                        .a(type[index]);
                }

                const elementQuick = res.body.template.quickReplies;
                console.log(elementQuick);
                const array = ['학점 수정', '학년 변경', '학번 변경', '학적상태 변경', '공학인증상태 변경', '설정 초기화']
                for (let index = 0; index < elementQuick.length; index++) {
                    expect(elementQuick[index].label)
                        .to
                        .equal(array[index]);
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});