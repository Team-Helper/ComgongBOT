const express = require('express');
const admin = require('firebase-admin');

async function checkAuth(req) {
    // console.log(req);
    const result = await admin
        .auth()
        .getUserByEmail('test@test.com')
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            return true;
            // const responseBody = {
            //     version: "2.0",
            //     template: {
            //         outputs: [
            //             {
            //                 itemCard: {
            //                     "head": {
            //                         "title": "누락된 설정이 있습니다."
            //                     },
            //                     "itemList": [
            //                         {
            //                             "title": "이메일",
            //                             "description": "O"
            //                         }, {
            //                             "title": "학년/학번",
            //                             "description": "X"
            //                         }, {
            //                             "title": "학점",
            //                             "description": "X"
            //                         }
            //                     ],
            //                     "title": "컴공봇 이용을 위해 이메일 인증과 학년/학번 그리고 학점 입력은 필수 입니다."
            //                 }
            //             }
            //         ],
            //         quickReplies: [
            //             {
            //                 "messageText": "학년/학번을 입력할게",
            //                 "action": "block",
            //                 "blockId": req,
            //                 "label": "학년/학번 입력"
            //             }
            //         ]
            //     }
            // };
            // return responseBody;
        })
        .catch((error) => {
            // console.log('Error fetching user data:', error);
            const responseBody = {
                version: "2.0",
                template: {
                    outputs: [
                        {
                            itemCard: {
                                "head": {
                                    "title": "누락된 설정이 있습니다."
                                },
                                "itemList": [
                                    {
                                        "title": "이메일",
                                        "description": "X"
                                    }, {
                                        "title": "학년/학번",
                                        "description": "X"
                                    }, {
                                        "title": "학점",
                                        "description": "X"
                                    }
                                ],
                                "title": "컴공봇 이용을 위해 이메일 인증과 학년/학번 그리고 학점 입력은 필수 입니다."
                            }
                        }
                    ],
                    quickReplies: [
                        {
                            "messageText": "이메일 인증할게",
                            "action": "block",
                            "blockId": req,
                            "label": "이메일 인증"
                        }
                    ]
                }
            };
            return responseBody;
        });
    return result;
}

module.exports = checkAuth;