const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /personal', () => {
    it('responds fail auth type object and content', done => {
        request(functions.config().service_url.app)
            .post('/personal')
            .set({
                key: functions
                    .config()
                    .service_url
                    .personal_key
            })
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
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds fail auth quickReplies correct label', done => {
        request(functions.config().service_url.app)
            .post('/personal')
            .set({
                key: functions
                    .config()
                    .service_url
                    .personal_key
            })
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

    it('responds success auth type object and content', done => {
        request(functions.config().service_url.app)
            .post('/personal')
            .set({
                key: functions
                    .config()
                    .service_url
                    .personal_key
            })
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
                    .include('원하시는 메뉴를 선택해주세요')
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds success auth quickReplies correct label', done => {
        request(functions.config().service_url.app)
            .post('/personal')
            .set({
                key: functions
                    .config()
                    .service_url
                    .personal_key
            })
            .expect(201)
            .then(res => {
                const element = res.body.template.quickReplies;
                // console.log(element);
                const array = ['조회', '계산', '확인']
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