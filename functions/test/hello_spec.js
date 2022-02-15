const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('GET /', () => {
    it('responds success case', done => {
        request(functions.config().service_url.app)
            .post('/')
            .expect(200)
            .then(res => {
                console.log(res.text);
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });

    it('responds fail case', done => {
        request(functions.config().service_url.app)
            .post('/')
            .expect(200)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .itemCard;
                // console.log(element);
                expect(element)
                    .to
                    .be
                    .an('object');

                const headTitle = element.head.title;
                // console.log(headTitle);
                expect(headTitle)
                    .to
                    .equal('누락된 설정이 있습니다.');

                const item = element.itemList;
                for (let index = 0; index < item.length; index++) {
                    const data = item[index];
                    // console.log(data);
                    expect(data.title)
                        .to
                        .be
                        .a('string')
                    expect(data.description)
                        .to
                        .be
                        .a('string')
                }
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});