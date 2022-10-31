const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const startAuth = require('../start-auth');

router.post('/', async function (req, res) {
    /* 사용자의 카카오 채널 추가 상태와 이메일 인증 여부를 통해 사용자가 요청한 학과 개인 서비스 데이터 혹은 경고문 출력 */
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.userRequest.utterance;
    const checkAuth = await startAuth(userAbout);
    // console.log(userRequest);
    let responseBody;
    /* 사용자 프로필 DB 조회*/
    let firestore = admin.firestore();
    let userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    let userData;
    /* 뒤로가기 작성 */
    const quickReplies = [
        {
            "messageText": "뒤로 돌아갈래",
            "action": "block",
            "blockId": functions
                .config()
                .service_key
                .personal_hub,
            "label": "↩ 뒤로가기"
        }
    ];
    let title;
    let description;
    let itemList = [];

    if (checkAuth === true) {
        switch (userRequest) {
            case "나의 누적 학점을 알려줘":
                {
                    /* 사용자 프로필 DB에 학점 값 전체 조회 */
                    userData = await userSelect.get();
                    title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
                    description = [
                        userData
                            .data()
                            .credits
                            .majorMust,
                        userData
                            .data()
                            .credits
                            .majorChoice,
                        userData
                            .data()
                            .credits
                            .electiveMust,
                        userData
                            .data()
                            .credits
                            .electiveChoice,
                        userData
                            .data()
                            .credits
                            .total
                    ];
                    /* 아이템 카드 뷰 블록 본문 내용으로 작성 및 출력 */
                    title.forEach((value, index) => {
                        itemList.push({"title": value, "description": description[index]});
                    });
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    itemCard: {
                                        "head": {
                                            "title": "☑ 누적 학점 조회"
                                        },
                                        "itemList": itemList,
                                        "title": "학점은 설정을 통해 언제든지 수정이 가능합니다."
                                    }
                                }
                            ],
                            quickReplies: quickReplies
                        }
                    };
                    break;
                }

            case "졸업까지 남은 학점을 계산해줘":
                {
                    userData = await userSelect.get();
                    /* 사용자 프로필 DB에 학번 값이 입학년도 2글자로 되어 있기에 올해 연도 앞의 2글자를 추출해 전체연도로 설정 */
                    const thisYear = new Date()
                        .getFullYear()
                        .toString()
                        .substr(0, 2);
                    const userStudentID = thisYear + userData
                        .data()
                        .studentID;
                    // console.log(userStudentID);
                    /* 사용자 프로필 DB의 학점 값 전체 조회 및 배열처리 */
                    title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
                    let majorMust,
                        majorChoice,
                        electiveMust,
                        electiveChoice,
                        total;
                    const graduateCredits = [majorMust, majorChoice, electiveMust, electiveChoice, total];
                    const user_electiveMust = userData
                        .data()
                        .credits
                        .electiveMust;
                    const user_electiveChoice = userData
                        .data()
                        .credits
                        .electiveChoice;
                    const user_majorMust = userData
                        .data()
                        .credits
                        .majorMust;
                    const user_majorChoice = userData
                        .data()
                        .credits
                        .majorChoice;
                    const user_total = userData
                        .data()
                        .credits
                        .total;
                    const user_creditList = [user_majorMust, user_majorChoice, user_electiveMust, user_electiveChoice, user_total];

                    /* 공학/일반인증 사용자를 구분지어 해당 인증 관련 졸업 학점 계산 수행 */
                    if (userData.data().engineeringStatus === true) {
                        /* 사용자 학번의 공학인증 DB 조회 및 최저이수학점 데이터를 추출*/
                        const engineerCreditsData = await firestore
                            .collection('engineeringCredits')
                            .doc(userStudentID)
                            .get();

                        const engineering_majorMust = engineerCreditsData
                            .data()
                            .majorMust;
                        const engineering_majorChoice = engineerCreditsData
                            .data()
                            .majorChoice;
                        const engineering_electiveMust = engineerCreditsData
                            .data()
                            .electiveMust;
                        const engineering_electiveChoice = engineerCreditsData
                            .data()
                            .electiveChoice;
                        const engineering_total = engineerCreditsData
                            .data()
                            .total;
                        const engineering_crditList = [engineering_majorMust, engineering_majorChoice, engineering_electiveMust, engineering_electiveChoice, engineering_total];

                        /* 사용자 학점을 토대로 졸업 학점 계산 처리 */
                        /* 또한, 사용자 학점 값이 최저이수요구 값보다 큰 경우엔 연산 결과 값을 0으로 치환 */
                        user_creditList.forEach((value, index) => {
                            graduateCredits[index] = (value > engineering_crditList[index])
                                ? 0 + '/' + engineering_crditList[index]
                                : engineering_crditList[index] - value + '/' + engineering_crditList[index];
                        });

                        /* 아이템 카드 뷰 블록으로 본문 내용 작성 */
                        title.forEach((value, index) => {
                            itemList.push({'title': value, 'description': graduateCredits[index]});
                        });
                    } else {
                        /* 사용자 학번의 일반인증 DB 조회 및 최저이수학점 데이터를 추출*/
                        const creditsData = await firestore
                            .collection('credits')
                            .doc(userStudentID)
                            .get();

                        const credits_majorMust = creditsData
                            .data()
                            .majorMust;
                        const credits_majorChoice = creditsData
                            .data()
                            .majorChoice;
                        const credits_electiveMust = creditsData
                            .data()
                            .electiveMust;
                        const credits_electiveChoice = creditsData
                            .data()
                            .electiveChoice;
                        const credits_total = creditsData
                            .data()
                            .total;
                        const credits_crditList = [credits_majorMust, credits_majorChoice, credits_electiveMust, credits_electiveChoice, credits_total]; 

                        /* 사용자 학점을 토대로 졸업 학점 계산 처리 */
                        /* 마찬가지로 사용자 학점 값이 최저이수요구 값보다 큰 경우엔 연산 결과 값을 0으로 치환 */
                        user_creditList.forEach((value, index) => {
                            graduateCredits[index] = (value > credits_crditList[index])
                                ? 0 + '/' + credits_crditList[index]
                                : credits_crditList[index] - value + '/' + credits_crditList[index];
                        });

                        /* 아이템 카드 뷰 블록으로 본문 내용 작성 */
                        title.forEach((value, index) => {
                            itemList.push({'title': value, 'description': graduateCredits[index]});
                        });
                    }
                    // console.log(itemList);
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    itemCard: {
                                        "head": {
                                            "title": "☑ 졸업까지 남은 학점 계산"
                                        },
                                        "itemList": itemList,
                                        "title": "[남은 학점/전체 학점]",
                                        "description": "계산은 컴공봇에 입력하신 학점을 토대로 계산됩니다."
                                    }
                                }
                            ],
                            quickReplies: quickReplies
                        }
                    };
                    break;
                }

            case "나의 졸업조건을 알려줘":
                {
                    userData = await userSelect.get();
                    let itemChoiceList = [];
                    let items = [];
                    title = [
                        "전공필수",
                        "전공선택",
                        "교양필수",
                        "교양선택",
                        "총 학점",
                        "채플 횟수"
                    ];
                    /* 사용자 프로필 DB에 학번 값이 입학년도 2글자로 되어 있기에 올해 연도 앞의 2글자를 추출해 전체연도로 설정 */
                    const thisYear = new Date()
                        .getFullYear()
                        .toString()
                        .substring(0, 2);
                    const userStudentID = thisYear + userData
                        .data()
                        .studentID;
                    // console.log(userStudentID);
                    /* 사용자의 공학 인증 상태를 조회 및 문자열로 치환 */
                    let userEngineeringStatus = userData
                        .data()
                        .engineeringStatus;
                    if (userEngineeringStatus === true) {
                        userEngineeringStatus = "공학인증";
                    } else {
                        userEngineeringStatus = "일반인증";
                    }

                    /* 공학/일반인증 사용자를 구분지어 해당 인증 관련 졸업 조건 데이터 조회 */
                    if (userEngineeringStatus === "공학인증") {
                        let itemSet = [];
                        /* 사용자 학번의 공학인증 DB 조회*/
                        const engineerCreditsData = await firestore
                            .collection('engineeringCredits')
                            .doc(userStudentID)
                            .get();

                        /* 해당 DB에 이수체계도, 최저이수학점 데이터를 추출 */
                        const completionSystem = engineerCreditsData
                            .data()
                            .completionSystem;
                        const credits = [
                            engineerCreditsData
                                .data()
                                .majorMust,
                            engineerCreditsData
                                .data()
                                .majorChoice,
                            engineerCreditsData
                                .data()
                                .electiveMust,
                            engineerCreditsData
                                .data()
                                .electiveChoice,
                            engineerCreditsData
                                .data()
                                .total,
                            engineerCreditsData
                                .data()
                                .chapel
                        ];
                        /* 학번에 따라 응답 구조를 작성 */
                        title.forEach((value, index) => {
                            itemList.push({'title': value, 'description': credits[index]});
                        });
                        if (parseInt(userStudentID) < 2015) {
                            itemSet.push(itemList);
                        } else {
                            itemSet.push(itemList, completionSystem);
                        }
                        // console.log(itemSet);
                        /* 작성한 구조만큼 응답 횟수와 블록을 생성 */
                        /* 순서는 아이템 카드 뷰, 이미지 뷰 블록 순으로 처리 */
                        itemSet.forEach((value, index) => {
                            if (index === 0) {
                                items.push({
                                    itemCard: {
                                        "head": {
                                            "title": `☑ 최저이수요구 학점표`
                                        },
                                        "itemList": itemList,
                                        "title": `본인 학번의 ${userEngineeringStatus} 최저이수요구 학점표 입니다.`
                                    }
                                });
                            } else {
                                // console.log(value, typeof value, Object.keys(value).length);
                                /* 이미지 뷰 블록 경우 작성된 이미지 데이터 개수 만큼 처리 */
                                for (let jndex = 0; jndex < Object.keys(value).length; jndex++) {
                                    // console.log(value[jndex]);
                                    items.push({
                                        simpleImage: {
                                            "imageUrl": value[jndex].imgURL,
                                            "altText": value[jndex].imgAlt
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        /* 사용자 학번의 일반인증 DB 조회*/
                        const creditsData = await firestore
                            .collection('credits')
                            .doc(userStudentID)
                            .get();

                        /* 해당 DB에 최저이수학점 데이터를 추출 */
                        const credits = [
                            creditsData
                                .data()
                                .majorMust,
                            creditsData
                                .data()
                                .majorChoice,
                            creditsData
                                .data()
                                .electiveMust,
                            creditsData
                                .data()
                                .electiveChoice,
                            creditsData
                                .data()
                                .total,
                            creditsData
                                .data()
                                .chapel
                        ];

                        /* 아이템 카드 뷰 블록 본문 내용으로 작성 */
                        title.forEach((value, index) => {
                            itemList.push({'title': value, 'description': credits[index]});
                        });

                        /* 전공 선택 유형 최저이수요구학점 데이터 조회 */
                        const choiceTitle = ['전공심화', '부전공', '복수전공'];
                        const choiceCredits = [
                            creditsData
                                .data()
                                .deepMajor,
                            creditsData
                                .data()
                                .minorMajor,
                            creditsData
                                .data()
                                .doubleMajor
                        ];
                        choiceTitle.forEach((value, index) => {
                            itemChoiceList.push({'title': value, 'description': choiceCredits[index]});
                        });

                        items.push({
                            itemCard: {
                                "head": {
                                    "title": `☑ 최저이수요구 학점표`
                                },
                                "itemList": itemList,
                                "title": `본인 학번의 ${userEngineeringStatus} 최저이수요구 학점표 입니다.`
                            }
                        });
                        items.push({
                            itemCard: {
                                "head": {
                                    "title": `☑ 전공 선택 유형별 최저이수요구 학점표`
                                },
                                "itemList": itemChoiceList,
                                "title": `본인 학번의 전공 선택 유형별 최저이수요구 학점표 입니다.`
                            }
                        });
                    }
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

    res
        .status(201)
        .send(responseBody);
});

module.exports = router;