const functions = require('firebase-functions');

exports.public_service = functions
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        const userRequest = req.body.userRequest;
        const check = userRequest.utterance;
        let responseBody;

        switch (check) {
            case "공지사항 게시판을 조회해줘":
                responseBody = {
                    version: "2.0",
                    template: {
                        outputs: [
                            {
                                simpleText: {
                                    text: "공지사항을 조회했어요!"
                                }
                            }
                        ]
                    }
                }
                break;
            default:
                break;
        }

        res
            .status(201)
            .send(responseBody);
    });