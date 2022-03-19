const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /setting/setting_service', () => {
    it('responds success modify studentID', done => {
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
                studentID_modify: {
                    groupName: '',
                    origin: '22',
                    value: '번호'
                }
            }
        }

        request(functions.config().service_url.app)
            .post(
                '/setting/studentID_correction'
            )
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
                // console.log(element);
                expect(element.text)
                    .to
                    .include("입력하신 학번으로 변경");
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });

    it('responds fail modify studentID', done => {
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
                studentID_modify: {
                    groupName: '',
                    origin: '22',
                    value: '번호'
                }
            }
        }

        request(functions.config().service_url.app)
            .post(
                '/setting/studentID_correction'
            )
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
                // console.log(element);
                expect(element.text)
                    .to
                    .include("같은 학번");
                const backElement = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(backElement);
                expect(backElement.messageText)
                    .to
                    .equal('나의 학번을 변경할게');
                expect(backElement.action)
                    .to
                    .equal('block');
                expect(backElement.label)
                    .to
                    .include('뒤로가기');
                done();
            })
            .catch(err => {
                console.error("Error >>", err);
                done(err);
            })
        });
});