const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const startAuth = require('../start-auth');

router.post('/', async function (req, res) {
    /* 사용자의 카카오 채널 추가 상태와 이메일 인증 여부를 통해 사용자가 요청한 학과 공용 서비스 데이터 혹은 경고문 출력 */
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.userRequest.utterance;
    const checkAuth = await startAuth(userAbout);
    let responseBody;
    let titleResult,
        dateResult,
        urlResult;
    let image;
    let info,
        name;
    let items = [];
    /* 뒤로가기 작성 */
    const quickReplies = [
        {
            "messageText": "뒤로 돌아갈래",
            "action": "block",
            "blockId": functions
                .config()
                .service_key
                .public_hub,
            "label": "↩ 뒤로가기"
        }
    ];

    if (checkAuth === true) {
        /* 각 공지사항별 DB 처리 된 형태에 맞춰 응답블록을 작성 및 출력 */
        switch (userRequest) {
            case "공지사항 게시판을 조회해줘":
                [titleResult, dateResult, urlResult] = await getData('notice');
                /* 리스트 뷰 블록 본문 내용으로 작성 */
                titleResult.forEach((value, index) => {
                    items.push({
                        "title": value,
                        "description": dateResult[index],
                        "link": {
                            "web": urlResult[index]
                        }
                    });
                });
                // console.log(titleResult, dateResult, urlResult);
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                listCard: {
                                    "header": {
                                        "title": "학과 공지사항"
                                    },
                                    "items": items,
                                    "buttons": [
                                        {
                                            "label": "학과 공지사항 페이지",
                                            "action": "webLink",
                                            "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4101/subview.do"
                                        }
                                    ]
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;

            case "새소식 게시판을 조회해줘":
                [titleResult, dateResult, urlResult] = await getData('newNews');
                /* 리스트 뷰 블록 본문 내용으로 작성 */
                titleResult.forEach((value, index) => {
                    items.push({
                        "title": value,
                        "description": dateResult[index],
                        "link": {
                            "web": urlResult[index]
                        }
                    });
                });
                // console.log(titleResult, dateResult, urlResult);
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                listCard: {
                                    "header": {
                                        "title": "학과 새소식"
                                    },
                                    "items": items,
                                    "buttons": [
                                        {
                                            "label": "학과 새소식 페이지",
                                            "action": "webLink",
                                            "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4102/subview.do"
                                        }
                                    ]
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;

            case "자유게시판을 조회해줘":
                [titleResult, dateResult, urlResult] = await getData('freeBoard');
                /* 리스트 뷰 블록 본문 내용으로 작성 */
                titleResult.forEach((value, index) => {
                    items.push({
                        "title": value,
                        "description": dateResult[index],
                        "link": {
                            "web": urlResult[index]
                        }
                    });
                });
                // console.log(titleResult, dateResult, urlResult);
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                listCard: {
                                    "header": {
                                        "title": "학과 자유게시판"
                                    },
                                    "items": items,
                                    "buttons": [
                                        {
                                            "label": "학과 자유게시판 페이지",
                                            "action": "webLink",
                                            "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4108/subview.do"
                                        }
                                    ]
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;

            case "외부IT행사 및 교육 게시판을 조회해줘":
                [titleResult, dateResult, urlResult] = await getData('education');
                /* 리스트 뷰 블록 본문 내용으로 작성 */
                titleResult.forEach((value, index) => {
                    items.push({
                        "title": value,
                        "description": dateResult[index],
                        "link": {
                            "web": urlResult[index]
                        }
                    });
                });
                // console.log(titleResult, dateResult, urlResult);
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                listCard: {
                                    "header": {
                                        "title": "외부IT행사 및 교육"
                                    },
                                    "items": items,
                                    "buttons": [
                                        {
                                            "label": "외부IT행사&교육 페이지",
                                            "action": "webLink",
                                            "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4104/subview.do"
                                        }
                                    ]
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;

            case "공학인증자료실 게시판을 조회해줘":
                [titleResult, dateResult, urlResult] = await getData('engineering');
                /* 리스트 뷰 블록 본문 내용으로 작성 */
                titleResult.forEach((value, index) => {
                    items.push({
                        "title": value,
                        "description": dateResult[index],
                        "link": {
                            "web": urlResult[index]
                        }
                    });
                });
                // console.log(titleResult, dateResult, urlResult);
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                listCard: {
                                    "header": {
                                        "title": "학과 공학인증자료실"
                                    },
                                    "items": items,
                                    "buttons": [
                                        {
                                            "label": "학과 공학인증자료실 페이지",
                                            "action": "webLink",
                                            "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4100/subview.do"
                                        }
                                    ]
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;

            case "교과과정을 조회해줘":
                image = await getImg('curriculum', null);
                // console.log(image);
                /* 이미지 뷰 블록 내용으로 작성 및 출력 */
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleImage: {
                                    "imageUrl": image,
                                    "altText": "교과과정"
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;

            case "올해 이수체계도를 조회해줘":
                {
                    image = await getImg('completionSystem');
                    // console.log(image);
                    /* 응답 횟수만큼 이미지 뷰 블록을 작성 및 출력*/
                    image.forEach((value) => {
                        items.push({
                            simpleImage: {
                                "imageUrl": value.imgURL,
                                "altText": value.imgAlt
                            }
                        });
                    });
                    // console.log(items);
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: items,
                            quickReplies: quickReplies
                        }
                    };
                    break;
                }

            /* 교수진소개 경우 이미지를 포함해 다양한 내용이 출력되야하기에 DB 조회 내용을 따로 작성*/
            case "교수진소개 게시판을 조회해줘":
                {
                    image = new Array();
                    info = new Array();
                    name = new Array();

                    await admin
                        .database()
                        .ref('facultyIntroduction')
                        .once('value')
                        .then(snapshot => {
                            snapshot.forEach(value => {
                                image.push(value.val().img);
                                info.push(value.val().info);
                                name.push(value.val().name);
                            });
                        });
                    // console.log(image, info, name);
                    /* DB 데이터 개수 만큼 기본 카드 뷰 블록을 작성 */
                    let data = [];
                    image.forEach((value, index) => {
                        data.push({
                            "title": name[index],
                            "description": info[index],
                            "thumbnail": {
                                "imageUrl": value,
                                "fixedRatio": true
                            },
                            "buttons": [
                                {
                                    "action": "webLink",
                                    "label": "상세보기",
                                    "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4123/subview.do"
                                }
                            ]
                        });
                        /* 캐러셀 구조로 출력하는데 응답 한번에 최대 출력 횟수가 10인만큼 응답 횟수를 늘려 데이터 전체 출력 */
                        if (data.length === 10 || index === info.length - 1) {
                            items.push({
                                carousel: {
                                    "type": "basicCard",
                                    "items": data
                                }
                            });
                            data = [];
                        }
                    });
                    // console.log(items);
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: items,
                            quickReplies: quickReplies
                        }
                    };
                    break;
                }

            default:
                break;
        }
    } else {
        responseBody = checkAuth;
    }

    /* 요청한 게시판 DB 조회 */
    async function getData(params) {
        let title = new Array();
        let date = new Array();
        let url = new Array();

        for (let index = 1; index <= 5; index++) {
            await admin
                .database()
                .ref(params)
                .child(index)
                .once('value')
                .then(snapshot => {
                    title.push(snapshot.val().title);
                    date.push(snapshot.val().date);
                    url.push(snapshot.val().url);
                })
                .catch(err => {
                    console.error('Error from public_service getData :', err);
                });
        }
        return [title, date, url];
    }

    /* 교과과정, 이수체계도 이미지 DB 조회 */
    /* 단일 혹은 여러 이미지 출력이 요청될 수 있기에 인덱스 값의 파라미터를 추가로 지정 */
    async function getImg(params, index) {
        let imageData;
        // console.log(params, index);

        if (index === null) {
            imageData = await admin
                .database()
                .ref(params)
                .child('imgURL')
                .once('value')
                .then(snapshot => {
                    return snapshot.val();
                })
                .catch(err => {
                    console.error('Error from public_service getImg :', err);
                });
        } else {
            imageData = [];
            await admin
                .database()
                .ref(params)
                .once('value')
                .then(snapshot => {
                    snapshot.forEach(value => {
                        imageData.push(value.val());
                    });
                })
                .catch(err => {
                    console.error('Error from public_service getImg :', err);
                });
        }
        return imageData;
    }

    res
        .status(201)
        .send(responseBody);
});

module.exports = router;