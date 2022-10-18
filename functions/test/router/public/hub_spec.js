const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /public', () => {
    /* 테스트 단위 : 채널 추가가 안되어있을 때 */
    it('responds isFriend is false', done => {
        /* 테스트 사용자의 채널추가, 프로필 정보 명시 */
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": undefined
                }
            }
        };
        request(functions.config().test_url.app)
            .post('/public')
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
                /* 응답 결과가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .include("컴공봇 채널 추가부터");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    /* 테스트 단위 : 채널은 추가되었으나 프로필 인증이 안되었을 때 */
    it('responds isFriend is true but auth fail', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            }
        };
        request(functions.config().test_url.app)
            .post('/public')
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
                expect(element.head.title)
                    .to
                    .be
                    .a('string');
                expect(element.head.title)
                    .to
                    .include('누락된 설정이');
                expect(element.title)
                    .to
                    .be
                    .a('string');
                expect(element.title)
                    .to
                    .equal('컴공봇 이용을 위해 이메일 인증과 학번 입력은 필수 입니다.');

                const elementItems = element.itemList;
                const title = ['이메일', '학번'];
                /* 본문 내용 응답 결과가 지정한 개수, 데이터 타입, 내용인지를 테스트 */
                expect(Object.keys(elementItems).length)
                    .to
                    .equal(title.length);
                for (let index = 0; index < elementItems.length; index++) {
                    const itemTitle = elementItems[index].title;
                    const itemDescription = elementItems[index].description;

                    expect(itemTitle)
                        .to
                        .equal(title[index]);
                    expect(itemDescription)
                        .to
                        .include('미설정');
                }
                // console.log(element.buttons[0]);
                /* 버튼 응답 결과가 지정한 데이터 타입, 내용인지릍 테스트 */
                expect(typeof element.buttons[0].label)
                    .to
                    .be
                    .a('string');
                expect(element.buttons[0].label)
                    .to
                    .equal('이메일 인증');
                expect(element.buttons[0].action)
                    .to
                    .equal('webLink');
                expect(element.buttons[0].webLinkUrl)
                    .to
                    .be
                    .a('string');
                expect(element.buttons[0].webLinkUrl)
                    .to
                    .include('컴공봇');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });

    /* 테스트 단위 : 프로필 인증까지 완료되어있을 때 */
    it('responds all success', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": functions
                        .config()
                        .service_key
                        .testID,
                    "isFriend": true
                }
            }
        };
        request(functions.config().test_url.app)
            .post('/public')
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
                /* 응답 결과 구조가 지정한 데이터 타입, 내용인지를 테스트 */
                expect(element)
                    .to
                    .be
                    .an('object');
                expect(element.text)
                    .to
                    .be
                    .a('string');
                expect(element.text)
                    .to
                    .include('원하시는 학과 메뉴를 선택');

                /* 바로가기 응답 결과가 지정한 개수, 데이터 타입, 내용인지를 테스트 */
                const elementQuick = res.body.template.quickReplies;
                // console.log(elementQuick);
                const array = [
                    '공지사항',
                    '새소식',
                    '자유게시판',
                    '외부IT',
                    '공학인증',
                    '교과과정',
                    '이수체계도',
                    '교수진'
                ];
                expect(elementQuick)
                    .to
                    .have
                    .lengthOf(array.length);
                for (let index = 0; index < elementQuick.length; index++) {
                    expect(elementQuick[index].action)
                        .to
                        .equal('block');
                    expect(elementQuick[index].label)
                        .to
                        .include(array[index]);
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            });
    });
});