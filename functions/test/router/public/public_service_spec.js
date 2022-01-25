const request = require('supertest');
const {expect} = require('chai');

describe('POST /public_service', () => {
    it('responds simple text', done => {
        const userRequest = {
            utterance: "공지사항 게시판을 조회해줘"
        };

        request('http://localhost:5000/comgong-bot/asia-northeast1')
            .post(
                '/public_service'
            )
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
});