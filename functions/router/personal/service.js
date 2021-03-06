const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const startAuth = require('../start-auth');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties; // 사용자 카카오 채널 정보
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.userRequest.utterance; // 사용자 요청문
    const checkAuth = await startAuth(userAbout); // 이메일 인증을 통한 프로필 설정 확인
    // console.log(userRequest);
    let responseBody; // 응답 블록 구조
    /* 사용자 프로필 DB 조회*/
    let firestore = admin.firestore();
    let userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    let userData;
    const quickReplies = [
        {
            // 바로가기 작성
            "messageText": "뒤로 돌아갈래",
            "action": "block",
            "blockId": functions
                .config()
                .service_key
                .personal_hub,
            "label": "↩ 뒤로가기"
        }
    ];
    /* 아이템 카드 뷰의 본문 목차와 내용 작성 관련*/
    let title;
    let description;
    let itemList = [];

    if (checkAuth === true) { // 사용자가 프로필 설정이 되어있다면
        switch (userRequest) { // 사용자 요청문 내용에 따른 개별 처리
            case "나의 누적 학점을 알려줘":
                {
                    userData = await userSelect.get(); // 사용자 프로필 DB 값 변수처리
                    /* 사용자 학점 데이터 get*/
                    title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
                    description = [
                        userData
                            .data()
                            .credits
                            .majorA,
                        userData
                            .data()
                            .credits
                            .majorB,
                        userData
                            .data()
                            .credits
                            .geA,
                        userData
                            .data()
                            .credits
                            .geB,
                        userData
                            .data()
                            .credits
                            .total
                    ];
                    /* 아이템 카드 뷰 본문 작성*/
                    title.forEach((value, index) => {
                        itemList.push({"title": value, "description": description[index]});
                    });
                    responseBody = {
                        version: "2.0",
                        template: {
                            outputs: [
                                {
                                    itemCard: { // 아이템 카드 뷰 블록으로 출력
                                        "head": {
                                            "title": "☑ 누적 학점 조회"
                                        },
                                        "itemList": itemList,
                                        "title": "학점은 설정을 통해 언제든지 수정이 가능합니다."
                                    }
                                }
                            ],
                            quickReplies: quickReplies // 바로가기 출력
                        }
                    };
                    break;
                }

            case "졸업까지 남은 학점을 계산해줘":
                {
                    userData = await userSelect.get(); // 사용자 프로필 DB 값 변수처리
                    /* 사용자 학번 추출 및 현재년도 전체이름으로 설정*/
                    const thisYear = new Date()
                        .getFullYear()
                        .toString()
                        .substr(0, 2);
                    const userStudentID = thisYear + userData
                        .data()
                        .studentID;
                    // console.log(userStudentID);
                    title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"]; // 아이템 카드 뷰 목차 이름 작성
                    let majorA,
                        majorB,
                        geA,
                        geB,
                        total;
                    const graduateCredits = [majorA, majorB, geA, geB, total];
                    /* 지금까지 이수한 사용자 학점 추출 */
                    const user_geA = userData
                        .data()
                        .credits
                        .geA;
                    const user_geB = userData
                        .data()
                        .credits
                        .geB;
                    const user_majorA = userData
                        .data()
                        .credits
                        .majorA;
                    const user_majorB = userData
                        .data()
                        .credits
                        .majorB;
                    const user_total = userData
                        .data()
                        .credits
                        .total;
                    const user_creditList = [user_majorA, user_majorB, user_geA, user_geB, user_total]; // 지금까지 이수한 사용자 학점 리스트

                    if (userData.data().engineeringStatus === true) { // 공학인증 사용자 인 경우
                        const engineerCreditsData = await firestore
                            .collection('engineeringCredits')
                            .doc(userStudentID)
                            .get(); // 공학인증 관련 사용자 학번의 학점DB 조회
                        /* 공학인증 전체 교과목 남은 학점 계산 */
                        const engineering_majorA = engineerCreditsData
                            .data()
                            .majorA;
                        const engineering_majorB = engineerCreditsData
                            .data()
                            .majorB;
                        const engineering_geA = engineerCreditsData
                            .data()
                            .geA;
                        const engineering_geB = engineerCreditsData
                            .data()
                            .geB;
                        const engineering_total = engineerCreditsData
                            .data()
                            .total;

                        const engineering_crditList = [engineering_majorA, engineering_majorB, engineering_geA, engineering_geB, engineering_total]; // 공학인증 이수학점 리스트

                        /* 전체 교과목 남은 학점 계산 */
                        user_creditList.forEach((value, index) => {
                            graduateCredits[index] = (value > engineering_crditList[index])
                                ? 0 + '/' + engineering_crditList[index]
                                : engineering_crditList[index] - value + '/' + engineering_crditList[index];
                        });

                        /* 아이템 카드 뷰 본문 작성*/
                        title.forEach((value, index) => {
                            itemList.push({'title': value, 'description': graduateCredits[index]});
                        });
                    } else {
                        const creditsData = await firestore
                            .collection('credits')
                            .doc(userStudentID)
                            .get(); // 일반인증 관련 사용자 학번의 학점DB 조회
                        /* 일반인증 이수 학점 추출 */
                        const credits_majorA = creditsData
                            .data()
                            .majorA;
                        const credits_majorB = creditsData
                            .data()
                            .majorB;
                        const credits_geA = creditsData
                            .data()
                            .geA;
                        const credits_geB = creditsData
                            .data()
                            .geB;
                        const credits_total = creditsData
                            .data()
                            .total;

                        const credits_crditList = [credits_majorA, credits_majorB, credits_geA, credits_geB, credits_total]; // 일반인증 이수학점 리스트

                        /* 전체 교과목 남은 학점 계산 */
                        user_creditList.forEach((value, index) => {
                            graduateCredits[index] = (value > credits_crditList[index])
                                ? 0 + '/' + credits_crditList[index]
                                : credits_crditList[index] - value + '/' + credits_crditList[index];
                        });

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
                                    itemCard: { // 아이템 카드 뷰 블록으로 출력
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
                    userData = await userSelect.get(); // 사용자 프로필 DB 값 변수처리
                    let items = []; // 응답 블록의 내용을 처리
                    title = [
                        "전공필수",
                        "전공선택",
                        "교양필수",
                        "교양선택",
                        "총 학점",
                        "채플 횟수"
                    ]; // 아이템 카드 뷰 본문 목차 내용 작성
                    /* 사용자 학번 추출 및 현재년도 전체이름으로 설정*/
                    const thisYear = new Date()
                        .getFullYear()
                        .toString()
                        .substring(0, 2);
                    const userStudentID = thisYear + userData
                        .data()
                        .studentID;
                    // console.log(userStudentID);
                    let userEngineeringStatus = userData // 사용자 공학 인증 상태 데이터 변수처리
                        .data()
                        .engineeringStatus;
                    if (userEngineeringStatus === true) { // 공학인증 상태 일 경우
                        userEngineeringStatus = "공학인증";
                    } else { // 아닌 경우
                        userEngineeringStatus = "일반인증";
                    }

                    if (userEngineeringStatus === "공학인증") { // 공학인증 사용자일 경우
                        let itemSet = []; // 다중 응답 횟수 처리를 위한 임시 배열
                        const engineerCreditsData = await firestore
                            .collection('engineeringCredits')
                            .doc(userStudentID)
                            .get(); // 사용자 학번에 해당하는 공학인증 DB 연동
                        /* 사용자 학번의 공학인증 DB 이수체계도, 최저이수요구 학점표 데이터 추출 */
                        const completionSystem = engineerCreditsData
                            .data()
                            .completionSystem;
                        const credits = [
                            engineerCreditsData
                                .data()
                                .majorA,
                            engineerCreditsData
                                .data()
                                .majorB,
                            engineerCreditsData
                                .data()
                                .geA,
                            engineerCreditsData
                                .data()
                                .geB,
                            engineerCreditsData
                                .data()
                                .total,
                            engineerCreditsData
                                .data()
                                .chapel
                        ];
                        /* 학번에 따른 응답 구조 작성 */
                        title.forEach((value, index) => {
                            itemList.push({'title': value, 'description': credits[index]});
                        });
                        if (parseInt(userStudentID) < 2015) {
                            itemSet.push(itemList);
                        } else {
                            itemSet.push(itemList, completionSystem);
                        }
                        // console.log(itemSet);
                        /* 작성한 응답 횟수만큼 응답 블록 생성 */
                        itemSet.forEach((value, index) => {
                            if (index === 0) {
                                items.push({
                                    itemCard: { // 첫번째 응답은 아이템 카드 뷰 블록으로 출력
                                        "head": {
                                            "title": `☑ 최저이수요구 학점표`
                                        },
                                        "itemList": itemList,
                                        "title": `본인 학번의 ${userEngineeringStatus} 최저이수요구 학점표 입니다.`
                                    }
                                });
                            } else {
                                // console.log(value, typeof value, Object.keys(value).length);
                                /* 그 외 응답은 조회된 이미지 개수 별로 처리 */
                                for (let jndex = 0; jndex < Object.keys(value).length; jndex++) {
                                    // console.log(value[jndex]);
                                    items.push({
                                        simpleImage: { // 이미지별로 이미지 뷰 출력
                                            "imageUrl": value[jndex].imgURL,
                                            "altText": value[jndex].imgAlt
                                        }
                                    });
                                }
                            }
                        });
                    } else { // 일반인증 사용자일 경우
                        const creditsData = await firestore
                            .collection('credits')
                            .doc(userStudentID)
                            .get(); // 사용자 학번에 해당하는 일반인증 DB 연동
                        /* 사용자 학번의 일반인증 DB 최저이수요구 학점표 데이터 추출 */
                        const credits = [
                            creditsData
                                .data()
                                .majorA,
                            creditsData
                                .data()
                                .majorB,
                            creditsData
                                .data()
                                .geA,
                            creditsData
                                .data()
                                .geB,
                            creditsData
                                .data()
                                .total,
                            creditsData
                                .data()
                                .chapel
                        ];
                        /* 응답 구조인 아이템 카드 뷰 작성 */
                        title.forEach((value, index) => {
                            itemList.push({'title': value, 'description': credits[index]});
                        });

                        items.push({
                            itemCard: { // 아이템 카드 뷰 블록으로 출력
                                "head": {
                                    "title": `☑ 최저이수요구 학점표`
                                },
                                "itemList": itemList,
                                "title": `본인 학번의 ${userEngineeringStatus} 최저이수요구 학점표 입니다.`
                            }
                        });
                    }
                    // console.log(items);
                    responseBody = {
                        version: "2.0",
                        template: { // 작성한 응답 횟수별로 구조 조정
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
        responseBody = checkAuth; // 프로필 설정이 안되었다면 누락 설정 블록으로
    }

    res
        .status(201)
        .send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;