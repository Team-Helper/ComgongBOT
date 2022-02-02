const request = require('supertest');
const {expect} = require('chai');
require('dotenv').config();

describe('POST /public_service', () => {
    it('responds simple text', done => {
        const userRequest = {
            utterance: "공지사항 게시판을 조회해줘"
        };

        request(process.env.appUrl)
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
                    .simpleText
                    .text;
                // console.log(element);
                expect(element)
                    .to
                    .equal('공지사항을 조회했어요!');
                done();
            })
            .catch(err => {
                console.error("######Error >>", err);
                done(err);
            })
        });
    it('responds simple text2', done => {
        const userRequest = {
            utterance: "새소식 게시판을 조회해줘"
        };

        request(process.env.appUrl)
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
                    .simpleText
                    .text;
                // console.log(element);
                expect(element)
                    .to
                    .equal('새소식을 조회했어요!');
                done();
            })
            .catch(err => {
                console.error("######Error >>", err);
                done(err);
            })
        });
    it('responds simple text3', done => {
        const userRequest = {
            utterance: "자유게시판을 조회해줘"
        };

        request(process.env.appUrl)
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
                    .simpleText
                    .text;
                // console.log(element);
                expect(element)
                    .to
                    .equal('자유게시판을 조회했어요!');
                done();
            })
            .catch(err => {
                console.error("######Error >>", err);
                done(err);
            })
        });
    it('responds simple text4', done => {
        const userRequest = {
            utterance: "외부IT행사 및 교육 게시판을 조회해줘"
        };

        request(process.env.appUrl)
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
                    .simpleText
                    .text;
                // console.log(element);
                expect(element)
                    .to
                    .equal('외부IT행사 및 교육을 조회했어요!');
                done();
            })
            .catch(err => {
                console.error("######Error >>", err);
                done(err);
            })
        });
    it('responds simple text5', done => {
        const userRequest = {
            utterance: "공학인증자료실 게시판을 조회해줘"
        };

        request(process.env.appUrl)
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
                    .simpleText
                    .text;
                // console.log(element);
                expect(element)
                    .to
                    .equal('공학인증자료실을 조회했어요!');
                done();
            })
            .catch(err => {
                console.error("######Error >>", err);
                done(err);
            })
        });
    it('responds simple text6', done => {
        const userRequest = {
            utterance: "교과과정 게시판을 조회해줘"
        };

        request(process.env.appUrl)
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
                    .simpleText
                    .text;
                // console.log(element);
                expect(element)
                    .to
                    .equal('교과과정을 조회했어요!');
                done();
            })
            .catch(err => {
                console.error("######Error >>", err);
                done(err);
            })
        });
    it('responds simple text7', done => {
        const userRequest = {
            utterance: "이수체계도 게시판을 조회해줘"
        };

        request(process.env.appUrl)
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
                    .simpleText
                    .text;
                // console.log(element);
                expect(element)
                    .to
                    .equal('이수체계도를 조회했어요!');
                done();
            })
            .catch(err => {
                console.error("######Error >>", err);
                done(err);
            })
        });
    it('responds simple text8', done => {
        const userRequest = {
            utterance: "교수진소개 게시판을 조회해줘"
        };

        request(process.env.appUrl)
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
                    .simpleText
                    .text;
                // console.log(element);
                expect(element)
                    .to
                    .equal('교수진소개를 조회했어요!');
                done();
            })
            .catch(err => {
                console.error("######Error >>", err);
                done(err);
            })
        });
});