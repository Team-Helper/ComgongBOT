const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    //console.log(req.body.userRequest.user.id);
    const userAbout = req.body.userRequest.user.properties; //사용자 정보
    //console.log(userAbout);
    const userRequest = req.body.userRequest.utterance; //사용자 요청문
    //console.log(userRequest);
    let responseBody; //응답 블록 구조
    /*사용자 프로필 DB 조회*/
    let firestore = admin.firestore();
    let userSelect = firestore
        .collection('users')
        .doc(userAbout.plusfriendUserKey);
    let userData;
    const quickReplies = [
        {
            //바로가기 작성
            "messageText": "뒤로 돌아갈래",
            "action": "block",
            "blockId": functions
                .config()
                .service_url
                .personalhub_key,
            "label": "↩ 뒤로가기"
        }
    ];

    switch (userRequest) { //사용자 요청문 내용에 따른 개별 처리
        case "나의 누적 학점을 알려줘":
            {
                userData = await userSelect.get(); //사용자 프로필 DB 값 변수처리
                /*사용자 학점 데이터 get*/
                const title = ["전공필수", "전공선택", "교양필수", "교양선택", "총 학점"];
                const description = [
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
                /*아이템 카드 뷰 본문 작성*/
                const itemList = [];
                title.forEach((value, index) => {
                    itemList.push({"title": value, "description": description[index]});
                });
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                itemCard: { //아이템 카드 뷰 블록으로 출력
                                    "head": {
                                        "title": "☑ 누적 학점 조회"
                                    },
                                    "itemList": itemList,
                                    "title": "학점은 설정을 통해 언제든지 수정이 가능합니다."
                                }
                            }
                        ],
                        quickReplies: quickReplies //바로가기 출력
                    }
                };
                break;
            }

        case "졸업까지 남은 학점을 계산해줘":
            {
                userData = await userSelect.get();
                const thieYear = new Date()
                    .getFullYear()
                    .toString()
                    .substr(0, 2); //현재 년도 앞의 2자리 추출
                //console.log(thieYear);
                const userStudentID = thieYear + userData
                    .data()
                    .studentID; //추출 한 값을 사용자 학번 값에 앞자리 년도로 추가
                /*출력 item 리스트 */
                const title = ['전공필수', '전공선택', '교양필수', '교양선택', '총 학점'];
                const itemList = [];
                /*사용자가 공학인증 상태 시 */
                if (userData.data().engineeringStatus == true) {
                    /*공학인증 관련 사용자 학번 학점DB 조회*/
                    const engineerCreditsSelect = firestore.collection('engineeringCredits');
                    const engineerCreditsData = await engineerCreditsSelect
                        .doc(userStudentID)
                        .get();
                    /*남은 학점 계산 */
                    const geA = engineerCreditsData
                        .data()
                        .geA - parseInt(userData.data().credits.geA) + '/' +
                            engineerCreditsData
                        .data()
                        .geA;
                    const geB = engineerCreditsData
                        .data()
                        .geB - parseInt(userData.data().credits.geB) + '/' +
                            engineerCreditsData
                        .data()
                        .geB;
                    const majorA = engineerCreditsData
                        .data()
                        .majorA - parseInt(userData.data().credits.majorA) + '/' +
                            engineerCreditsData
                        .data()
                        .majorA;
                    const majorB = engineerCreditsData
                        .data()
                        .majorB - parseInt(userData.data().credits.majorB) + '/' +
                            engineerCreditsData
                        .data()
                        .majorB;
                    const total = engineerCreditsData
                        .data()
                        .total - parseInt(userData.data().credits.total) + '/' +
                            engineerCreditsData
                        .data()
                        .total;

                    /*아이템 카드 뷰 본문 작성*/
                    const graduateCredits = [majorA, majorB, geA, geB, total];
                    title.forEach((value, index) => {
                        itemList.push({'title': value, 'description': graduateCredits[index]});
                    });
                } else {
                    /*일반인증 관련 사용자 학번 학점DB 조회*/
                    const creditsSelect = firestore.collection('credits');
                    const creditsData = await creditsSelect
                        .doc(userStudentID)
                        .get();

                    const geA = creditsData
                        .data()
                        .geA - parseInt(userData.data().credits.geA) + '/' + creditsData
                        .data()
                        .geA;
                    const geB = creditsData
                        .data()
                        .geB - parseInt(userData.data().credits.geB) + '/' + creditsData
                        .data()
                        .geB;
                    const majorA = creditsData
                        .data()
                        .majorA - parseInt(userData.data().credits.majorA) + '/' + creditsData
                        .data()
                        .majorA;
                    const majorB = creditsData
                        .data()
                        .majorB - parseInt(userData.data().credits.majorB) + '/' + creditsData
                        .data()
                        .majorB;
                    const total = creditsData
                        .data()
                        .total - parseInt(userData.data().credits.total) + '/' + creditsData
                        .data()
                        .total;

                    const graduateCredits = [majorA, majorB, geA, geB, total];
                    title.forEach((value, index) => {
                        itemList.push({'title': value, 'description': graduateCredits[index]});
                    });
                }
                //console.log(itemList);
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                itemCard: {
                                    "head": {
                                        "title": "☑ 졸업까지 남은 학점 조회"
                                    },
                                    "itemList": itemList,
                                    "title": "[남은 학점/전체 학점]",
                                    "description": "본인 학번의 졸업까지 남은 학점 계산 결과입니다."
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;
            }

        case "교과목별 최저이수 요구학점을 알려줘":
            {
                /*사용자 데이터 get */
                userData = await userSelect.get();
                /*사용자 학번 추출 */
                const thieYear = new Date()
                    .getFullYear()
                    .toString()
                    .substring(0, 2);
                const userStudentID = thieYear + userData
                    .data()
                    .studentID;
                /*출력 item 리스트 */
                const title = ['채플', '이수체계도', '설계-이수체계도'];
                const itemList = [];

                if (userData.data().engineeringStatus == true) {
                    /*사용자 학번에 매칭되는 공학인증 DB 추출 */
                    const engineerCreditsSelect = firestore.collection('engineeringCredits');
                    const engineerCreditsData = await engineerCreditsSelect
                        .doc(userStudentID)
                        .get();
                    /*사용자 채플, 이수체계도 데이터 추출 */
                    const chapel = engineerCreditsData
                        .data()
                        .chapel;
                    const completionSystem = engineerCreditsData
                        .data()
                        .completionSystem;
                    const itmeSet = [];

                    if (parseInt(userStudentID) < 2015) {
                        itmeSet.push(chapel);
                    } else if (parseInt(userStudentID) == 2015) {
                        itmeSet.push(chapel, completionSystem);
                    } else {
                        itmeSet.push(chapel, completionSystem[0], completionSystem[1]);
                    }
                    itmeSet.forEach((value, index) => {
                        itemList.push({'title': title[index], 'description': value});
                    });
                } else {
                    /*사용자 학번에 매칭되는 공학인증 DB 추출 */
                    const creditsSelect = firestore.collection('credits');
                    const creditsData = await creditsSelect
                        .doc(userStudentID)
                        .get();
                    /*사용자 채플, 이수체계도 데이터 추출 */
                    const chapel = creditsData
                        .data()
                        .chapel;
                    const itemSet = [];

                    itemSet.push(chapel);
                    itemSet.forEach((value, index) => {
                        itemList.push({'title': title[index], 'description': value});
                    });
                }
                console.log(itemList);
                
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                itemCard: {
                                    "head": {
                                        "title": "☑ 졸업이수 조건 조회"
                                    },
                                    "itemList": itemList,
                                    "title": "본인 학번의 졸업이수 조건 결과입니다."
                                }
                            }
                        ],
                        quickReplies: quickReplies
                    }
                };
                break;
            }

        default:
            break;
    }
    res
        .status(201)
        .send(responseBody); //응답 상태 코드와 내용 전송
});

module.exports = router;