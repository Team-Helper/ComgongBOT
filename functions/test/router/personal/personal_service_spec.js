const request = require('supertest');
const {expect} = require('chai');
const functions = require('firebase-functions');

describe('POST /personal/personal_service', () => {
    it('responds check credits DB', done => {
        const userRequest = {
            user: {
                "properties": {
                    "plusfriendUserKey": "some-id",
                    "isFriend": true
                }
            },
            utterance: "나의 누적 학점을 알려줘"
        };

        request(functions.config().service_url.app)
            .post('/personal/personal_service')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({userRequest})
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
                    .include('누적 학점 조회')
                expect(element.title)
                    .to
                    .equal('학점은 설정을 통해 언제든지 수정이 가능합니다.')

                const elementItems = element.itemList;
                const title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
                for (let index = 0; index < elementItems.length; index++) {
                    const itemTitle = elementItems[index].title;
                    const itemDescription = elementItems[index].description;

                    expect(itemTitle)
                        .to
                        .equal(title[index]);
                    expect(itemDescription)
                        .to
                        .be
                        .a('number');
                }

                const elementQuick = res
                    .body
                    .template
                    .quickReplies[0];
                // console.log(elementQuick);
                expect(elementQuick.messageText)
                    .to
                    .include('뒤로 돌아갈래');
                expect(elementQuick.label)
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