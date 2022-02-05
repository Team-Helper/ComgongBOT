const request = require('supertest');
const {expect} = require('chai');
require('dotenv').config();

describe('POST /public', () => {
    it('responds type object', done => { // 응답 구조 타입 확인
        request(process.env.appUrl)
            .post('/public')
            .expect(201)
            .then(res => {
                // console.log(res.body);
                expect(res.body)
                    .to
                    .be
                    .an('object');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
    it('responds correct label', done => { // 응답 모델 레이블 값 확인
        request(process.env.appUrl)
            .post('/public')
            .expect(201)
            .then(res => {
                // console.log(res.body);
                const array = [
                    '공지사항',
                    '새소식',
                    '자유게시판',
                    '외부IT',
                    '공학인증',
                    '교과과정',
                    '이수체계도',
                    '교수진'
                ]
                for (let index = 0; index < res.body.template.quickReplies.length; index++) {
                    const element = res
                        .body
                        .template
                        .quickReplies[index]
                        .label;
                    expect(element)
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