const request = require('supertest');
const {expect} = require('chai');
const app = require('../../../index');

describe('POST /personal', () => {
    it('responds type object', done => {
        request(app)
            .post('/personal')
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
    it('responds correct label', done => {
        request(app)
            .post('/personal')
            .expect(201)
            .then(res => {
                console.log(res.body.template);
                const array = ['조회', '계산', '조건']
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