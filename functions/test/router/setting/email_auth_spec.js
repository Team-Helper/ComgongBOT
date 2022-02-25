const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/email_auth', () => {
    const userRequest = {
        user: {
            "properties": {
                "plusfriendUserKey": "some-id",
                "isFriend": true
            }
        }
    };
    const action = {
        detailParams: {
            email: {
                'groupName': '',
                'origin': 'test@sungkyul.ac.kr',
                'value': 'test@sungkyul.ac.kr'
            },
            grade: {
                'groupName': '',
                'origin': '4',
                'value': '번호'
            },
            studentID: {
                'groupName': '',
                'origin': '16',
                'value': '번호'
            }
        }
    }

    it('responds about', done => {
        request(functions.config().service_url.app)
            .post('/setting/email_auth')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
            .send({action})
            .expect(201)
            .then(res => {
                const element = res
                    .body
                    .template
                    .outputs[0]
                    .simpleText;
                expect(element.text)
                    .to
                    .equal('프로필 생성이 완료되었습니다. 이제 컴공봇을 자유롭게 이용하시기 바랍니다!');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});