const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    // console.log(req.body.userRequest.user.id);
    const userRequest = req.body.userRequest.utterance; // 사용자 요.청문
    let responseBody; // 응답 블록 구조
    let titleResult, // 각 DB별 값 저장
        dateResult,
        urlResult;
    let image; // 이미지 링크 저장
    let info,
        name // 교수진 소개 정보와 이름 저장
    let items = []; // 게시판 별 value 저장
    const quickReplies = [
        {
            // 바로가기 버튼 저장
            "messageText": "뒤로 돌아갈래",
            "action": "block",
            "blockId": functions
                .config()
                .service_url
                .publichub_key,
            "label": "🔙 뒤로가기"
        }
    ];

    switch (userRequest) {
        case "공지사항 게시판을 조회해줘":
            [titleResult, dateResult, urlResult] = await getData('notice'); // DB로 부터 해당 Key 값의 values 받기
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
                                    "title": "학과 공지사항" // 리스트 뷰 상단 문자열 작성
                                },
                                "items": items,
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
                    quickReplies: quickReplies
                }
            };
            break;
        case "새소식 게시판을 조회해줘":
            [titleResult, dateResult, urlResult] = await getData('newNews');
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
            }
            break;
        case "자유게시판을 조회해줘":
            [titleResult, dateResult, urlResult] = await getData('freeBoard');
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
            }
            break;
        case "외부IT행사 및 교육 게시판을 조회해줘":
            [titleResult, dateResult, urlResult] = await getData('education');
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
            }
            break;
        case "공학인증자료실 게시판을 조회해줘":
            [titleResult, dateResult, urlResult] = await getData('engineering');
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
            }
            break;
        case "교과과정을 조회해줘":
            image = await getImg('curriculum');
            // console.log(image);
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleImage: { // 이미지 뷰 블록 작성
                                "imageUrl": image,
                                "altText": "교과과정 이미지"
                            }
                        }
                    ],
                    quickReplies: quickReplies
                }
            }
            break;
        case "올해 이수체계도를 조회해줘":
            image = await getImg('completionSystem');
            // console.log(image);
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            simpleImage: {
                                "imageUrl": image,
                                "altText": "올해 이수체계도 이미지"
                            }
                        }
                    ],
                    quickReplies: quickReplies
                }
            }
            break;
        case "교수진소개 게시판을 조회해줘":
            image = new Array();
            info = new Array();
            name = new Array();
            for (let index = 1; index <= 10; index++) { // 10개의 교수진 소개 관련 DB 쿼리문 처리
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
            image.forEach((value, index) => {
                items.push({
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
            });
            // console.log(name, info, image);
            responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            carousel: { // 캐러셀 구조의 기본 카드형 응답 블록 작성
                                "type": "basicCard",
                                "items": items
                            }
                        }
                    ],
                    quickReplies: quickReplies
                }
            }
            break;
        default:
            break;
    }

    async function getData(params) { // DB 검색 쿼리문 처리 함수
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
                .catch(e => {
                    console.log('Error from public_service getData :', e);
                })
            }
        return [title, date, url];
    };

    async function getImg(params) { // DB 이미지 주소 검색 쿼리문 처리 함수
        const imageData = await admin
            .database()
            .ref(params)
            .child('imgUrl')
            .once('value')
            .then(snapshot => {
                return snapshot.val();
            });
        return imageData;
    }

    res
        .status(201)
        .send(responseBody); // 응답 전송
});

module.exports = router;