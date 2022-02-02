const request = require('supertest');
const {expect} = require('chai');
const app = require('../../../index');

describe('POST /setting', () => {
    it('responds type object', done => {
        request(app)
            .post('/setting')
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
            .post('/setting')
            .expect(201)
            .then(res => {
                // console.log(res.body);
                const array = ['수정', '변경', '상태']
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