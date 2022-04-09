const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /private', () => {
    const userRequest = {
        user: {
            "properties": {
                "plusfriendUserKey": "some-id",
                "isFriend": true
            }
        }
    };
    it('responds about isFriend is undefined', done => {
        request(functions.config().service_url.app)
            .post('/private')
            .set({
                key: functions
                    .config()
                    .service_url
                    .private_key
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
    it('responds about auth fail object type & content and quickReplies', done => {
        request(functions.config().service_url.app)
            .post('/private')
            .set({
                key: functions
                    .config()
                    .service_url
                    .private_key
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
                    .a('string');
                expect(element.head.title)
                    .to
                    .include('누락된 설정이')
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

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(element);
                expect(elementQuick.messageText)
                    .to
                    .equal('이메일 인증할게');
                expect(elementQuick.label)
                    .to
                    .equal('이메일 인증');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});