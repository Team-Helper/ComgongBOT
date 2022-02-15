const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userRequest = req.body.userRequest;
    const check = userRequest.utterance; // 사용자 요청문 인식
    let responseBody; // 응답 구조
    let titleResult, // 각 DB별 key 값 저장
        dateResult,
        urlResult;
    let image; // 이미지 링크 저장
    let info,
        name // 교수진 소개 정보와 이름 저장

    switch (check) {
        case "공지사항 게시판을 조회해줘":
            [titleResult, dateResult, urlResult] = await getData('notice'); // DB로 부터 해당 Key 값의 values 받기
            // console.log(titleResult, dateResult, urlResult);
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            "listCard": {
                                "header": {
                                    "title": "학과 공지사항" // 리스트 뷰 상단 문자열 작성
                                },
                                "items": [
                                    {
                                        "title": titleResult[0],
                                        "description": dateResult[0],
                                        "link": {
                                            "web": urlResult[0]
                                        }
                                    }, {
                                        "title": titleResult[1],
                                        "description": dateResult[1],
                                        "link": {
                                            "web": urlResult[1]
                                        }
                                    }, {
                                        "title": titleResult[2],
                                        "description": dateResult[2],
                                        "link": {
                                            "web": urlResult[2]
                                        }
                                    }, {
                                        "title": titleResult[3],
                                        "description": dateResult[3],
                                        "link": {
                                            "web": urlResult[3]
                                        }
                                    }, {
                                        "title": titleResult[4],
                                        "description": dateResult[4],
                                        "link": {
                                            "web": urlResult[4]
                                        }
                                    }
                                ],
                                "buttons": [
                                    { // 하단 버튼 생성
                                        "label": "학과 공지사항 페이지",
                                        "action": "webLink",
                                        "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4101/subview.do"
                                    }
                                ]
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            };
            break;
        case "새소식 게시판을 조회해줘":
            [titleResult, dateResult, urlResult] = await getData('newNews');
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            "listCard": {
                                "header": {
                                    "title": "학과 새소식" // 리스트 뷰 상단 문자열 작성
                                },
                                "items": [
                                    {
                                        "title": titleResult[0],
                                        "description": dateResult[0],
                                        "link": {
                                            "web": urlResult[0]
                                        }
                                    }, {
                                        "title": titleResult[1],
                                        "description": dateResult[1],
                                        "link": {
                                            "web": urlResult[1]
                                        }
                                    }, {
                                        "title": titleResult[2],
                                        "description": dateResult[2],
                                        "link": {
                                            "web": urlResult[2]
                                        }
                                    }, {
                                        "title": titleResult[3],
                                        "description": dateResult[3],
                                        "link": {
                                            "web": urlResult[3]
                                        }
                                    }, {
                                        "title": titleResult[4],
                                        "description": dateResult[4],
                                        "link": {
                                            "web": urlResult[4]
                                        }
                                    }
                                ],
                                "buttons": [
                                    { // 하단 버튼 생성
                                        "label": "학과 새소식 페이지",
                                        "action": "webLink",
                                        "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4102/subview.do"
                                    }
                                ]
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "자유게시판을 조회해줘":
            [titleResult, dateResult, urlResult] = await getData('freeBoard');
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            "listCard": {
                                "header": {
                                    "title": "학과 자유게시판" // 리스트 뷰 상단 문자열 작성
                                },
                                "items": [
                                    {
                                        "title": titleResult[0],
                                        "description": dateResult[0],
                                        "link": {
                                            "web": urlResult[0]
                                        }
                                    }, {
                                        "title": titleResult[1],
                                        "description": dateResult[1],
                                        "link": {
                                            "web": urlResult[1]
                                        }
                                    }, {
                                        "title": titleResult[2],
                                        "description": dateResult[2],
                                        "link": {
                                            "web": urlResult[2]
                                        }
                                    }, {
                                        "title": titleResult[3],
                                        "description": dateResult[3],
                                        "link": {
                                            "web": urlResult[3]
                                        }
                                    }, {
                                        "title": titleResult[4],
                                        "description": dateResult[4],
                                        "link": {
                                            "web": urlResult[4]
                                        }
                                    }
                                ],
                                "buttons": [
                                    { // 하단 버튼 생성
                                        "label": "학과 자유게시판 페이지",
                                        "action": "webLink",
                                        "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4108/subview.do"
                                    }
                                ]
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "외부IT행사 및 교육 게시판을 조회해줘":
            [titleResult, dateResult, urlResult] = await getData('education');
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            "listCard": {
                                "header": {
                                    "title": "외부IT행사 및 교육" // 리스트 뷰 상단 문자열 작성
                                },
                                "items": [
                                    {
                                        "title": titleResult[0],
                                        "description": dateResult[0],
                                        "link": {
                                            "web": urlResult[0]
                                        }
                                    }, {
                                        "title": titleResult[1],
                                        "description": dateResult[1],
                                        "link": {
                                            "web": urlResult[1]
                                        }
                                    }, {
                                        "title": titleResult[2],
                                        "description": dateResult[2],
                                        "link": {
                                            "web": urlResult[2]
                                        }
                                    }, {
                                        "title": titleResult[3],
                                        "description": dateResult[3],
                                        "link": {
                                            "web": urlResult[3]
                                        }
                                    }, {
                                        "title": titleResult[4],
                                        "description": dateResult[4],
                                        "link": {
                                            "web": urlResult[4]
                                        }
                                    }
                                ],
                                "buttons": [
                                    { // 하단 버튼 생성
                                        "label": "외부IT행사 및 교육 페이지",
                                        "action": "webLink",
                                        "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4104/subview.do"
                                    }
                                ]
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "공학인증자료실 게시판을 조회해줘":
            [titleResult, dateResult, urlResult] = await getData('engineering');
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            "listCard": {
                                "header": {
                                    "title": "학과 공학인증자료실" // 리스트 뷰 상단 문자열 작성
                                },
                                "items": [
                                    {
                                        "title": titleResult[0],
                                        "description": dateResult[0],
                                        "link": {
                                            "web": urlResult[0]
                                        }
                                    }, {
                                        "title": titleResult[1],
                                        "description": dateResult[1],
                                        "link": {
                                            "web": urlResult[1]
                                        }
                                    }, {
                                        "title": titleResult[2],
                                        "description": dateResult[2],
                                        "link": {
                                            "web": urlResult[2]
                                        }
                                    }, {
                                        "title": titleResult[3],
                                        "description": dateResult[3],
                                        "link": {
                                            "web": urlResult[3]
                                        }
                                    }, {
                                        "title": titleResult[4],
                                        "description": dateResult[4],
                                        "link": {
                                            "web": urlResult[4]
                                        }
                                    }
                                ],
                                "buttons": [
                                    { // 하단 버튼 생성
                                        "label": "학과 공학인증자료실 페이지",
                                        "action": "webLink",
                                        "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4100/subview.do"
                                    }
                                ]
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "교과과정을 조회해줘":
            image = await admin
                .database()
                .ref('curriculum')
                .child('imgUrl')
                .once('value')
                .then(snapshot => {
                    return snapshot.val();
                });
            // console.log(image);
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            "simpleImage": {
                                "imageUrl": image,
                                "altText": "교과과정 이미지"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "올해 이수체계도를 조회해줘":
            image = await admin
                .database()
                .ref('completionSystem')
                .child('imgUrl')
                .once('value')
                .then(snapshot => {
                    return snapshot.val();
                });
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            "simpleImage": {
                                "imageUrl": image,
                                "altText": "올해 이수체계도 이미지"
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        case "교수진소개 게시판을 조회해줘":
            image = new Array();
            info = new Array();
            name = new Array();
            for (let index = 1; index <= 10; index++) {
                await admin
                    .database()
                    .ref('facultyIntroduction')
                    .child(index)
                    .once('value')
                    .then(snapshot => {
                        image.push(snapshot.val().img);
                        info.push(snapshot.val().info);
                        name.push(snapshot.val().name);
                    })
                    .catch(e => {
                        console.log('Error from public_service facultyIntroduction :', e);
                    })
                }
            // console.log(name, info, image);
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            "carousel": {
                                "type": "basicCard",
                                "items": [
                                    {
                                        "title": name[0],
                                        "description": info[0],
                                        "thumbnail": {
                                            "imageUrl": image[0],
                                            "fixedRatio" : true
                                        },
                                        "buttons": [
                                            {
                                                "action": "webLink",
                                                "label": "상세보기",
                                                "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4123/subview.do"
                                            }
                                        ]
                                    }, {
                                        "title": name[1],
                                        "description": info[1],
                                        "thumbnail": {
                                            "imageUrl": image[1],
                                            "fixedRatio" : true
                                        },
                                        "buttons": [
                                            {
                                                "action": "webLink",
                                                "label": "상세보기",
                                                "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4123/subview.do"
                                            }
                                        ]
                                    }, {
                                        "title": name[2],
                                        "description": info[2],
                                        "thumbnail": {
                                            "imageUrl": image[2],
                                            "fixedRatio" : true
                                        },
                                        "buttons": [
                                            {
                                                "action": "webLink",
                                                "label": "상세보기",
                                                "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4123/subview.do"
                                            }
                                        ]
                                    }, {
                                        "title": name[3],
                                        "description": info[3],
                                        "thumbnail": {
                                            "imageUrl": image[3],
                                            "fixedRatio" : true
                                        },
                                        "buttons": [
                                            {
                                                "action": "webLink",
                                                "label": "상세보기",
                                                "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4123/subview.do"
                                            }
                                        ]
                                    }, {
                                        "title": name[4],
                                        "description": info[4],
                                        "thumbnail": {
                                            "imageUrl": image[4],
                                            "fixedRatio" : true
                                        },
                                        "buttons": [
                                            {
                                                "action": "webLink",
                                                "label": "상세보기",
                                                "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4123/subview.do"
                                            }
                                        ]
                                    }, {
                                        "title": name[5],
                                        "description": info[5],
                                        "thumbnail": {
                                            "imageUrl": image[5],
                                            "fixedRatio" : true
                                        },
                                        "buttons": [
                                            {
                                                "action": "webLink",
                                                "label": "상세보기",
                                                "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4123/subview.do"
                                            }
                                        ]
                                    }, {
                                        "title": name[6],
                                        "description": info[6],
                                        "thumbnail": {
                                            "imageUrl": image[6],
                                            "fixedRatio" : true
                                        },
                                        "buttons": [
                                            {
                                                "action": "webLink",
                                                "label": "상세보기",
                                                "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4123/subview.do"
                                            }
                                        ]
                                    }, {
                                        "title": name[7],
                                        "description": info[7],
                                        "thumbnail": {
                                            "imageUrl": image[7],
                                            "fixedRatio" : true
                                        },
                                        "buttons": [
                                            {
                                                "action": "webLink",
                                                "label": "상세보기",
                                                "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4123/subview.do"
                                            }
                                        ]
                                    }, {
                                        "title": name[8],
                                        "description": info[8],
                                        "thumbnail": {
                                            "imageUrl": image[8],
                                            "fixedRatio" : true
                                        },
                                        "buttons": [
                                            {
                                                "action": "webLink",
                                                "label": "상세보기",
                                                "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4123/subview.do"
                                            }
                                        ]
                                    }, {
                                        "title": name[9],
                                        "description": info[9],
                                        "thumbnail": {
                                            "imageUrl": image[9],
                                            "fixedRatio" : true
                                        },
                                        "buttons": [
                                            {
                                                "action": "webLink",
                                                "label": "상세보기",
                                                "webLinkUrl": "https://www.sungkyul.ac.kr/computer/4123/subview.do"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "뒤로 돌아갈래",
                            "action": "block",
                            "blockId": req.headers.back_key,
                            "label": "🔙 뒤로가기"
                        }
                    ]
                }
            }
            break;
        default:
            break;
    }

    async function getData(str) {
        let title = new Array();
        let date = new Array();
        let url = new Array();

        for (let index = 1; index <= 5; index++) {
            await admin
                .database()
                .ref(str)
                .child(index)
                .once('value')
                .then(snapshot => {
                    title.push(snapshot.val().title);
                    date.push(snapshot.val().date);
                    url.push(snapshot.val().url);
                })
                .catch(e => {
                    console.log('Error from public_service getData :', e);
                })
            }
        return [title, date, url];
    };

    res
        .status(201)
        .send(responseBody);
});

module.exports = router;