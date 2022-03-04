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

    it('responds success input profile DB', done => {
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
                    .equal('프로필 생성이 완료되었습니다. 하단의 버튼을 통해 본인의 학점도 바로 입력해보세요.!');

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .equal('학점 입력할게');
                expect(elementQuick.label)
                    .to
                    .equal('학점 입력');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});