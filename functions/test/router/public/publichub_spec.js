const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /public', () => {
    const userRequest = {
        user: {
            "properties": {
                "plusfriendUserKey": "some-id",
                "isFriend": true
            }
        }
    };
    it('responds auth fail about isFriend is false', done => {
        request(functions.config().service_url.app)
            .post('/public')
            .set({
                key: functions
                    .config()
                    .service_url
                    .public_key
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
                    .simpleText;
                // console.log(element);
                expect(element.text)
                    .to
                    .include("컴공봇 채널 추가부터");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds auth fail type object and content', done => {
        request(functions.config().service_url.app)
            .post('/public')
            .set({
                key: functions
                    .config()
                    .service_url
                    .public_key
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
                    .an('string');
                expect(element.head.title)
                    .to
                    .include('누락된 설정이 있습니다.')
                expect(element.title)
                    .to
                    .equal('컴공봇 이용을 위해 이메일 인증과 학년/학번 그리고 학점 입력은 필수 입니다.')

                const elementItems = element.itemList;
                const title = ['이메일', '학년/학번', '학점'];
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
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds auth fail quickReplies correct label', done => {
        request(functions.config().service_url.app)
            .post('/public')
            .set({
                key: functions
                    .config()
                    .service_url
                    .public_key
            })
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(element);
                expect(element.messageText)
                    .to
                    .equal('이메일 인증할게');
                expect(element.label)
                    .to
                    .equal('이메일 인증');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });

    it('responds auth success type object and content', done => {
        request(functions.config().service_url.app)
            .post('/public')
            .set({
                key: functions
                    .config()
                    .service_url
                    .public_key
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
                    .simpleText;
                // console.log(element);
                expect(element.text)
                    .to
                    .be
                    .an('string');
                expect(element.text)
                    .to
                    .include('원하시는 학과 메뉴를 선택해주세요.')
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds auth success quickReplies correct label', done => {
        request(functions.config().service_url.app)
            .post('/public')
            .set({
                key: functions
                    .config()
                    .service_url
                    .public_key
            })
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .expect(201)
            .then(res => {
                const element = res.body.template.quickReplies;
                // console.log(element);
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
                for (let index = 0; index < element.length; index++) {
                    expect(element[index].label)
                        .to
                        .include(array[index]);
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});