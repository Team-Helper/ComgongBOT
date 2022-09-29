const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.facultyIntroduction = functions
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        // console.log(req.body.admin);
        /* 어드민 인증 key 값이 있는지 요청 상태 인지를 확인해 크롤링 실행 혹은 미실행 */
        if (req.body.admin === functions.config().service_key.admin) {
            axios
                .get('https://www.sungkyul.ac.kr/computer/4123/subview.do') // 교수진 소개 페이지 주소
                .then(async (html) => {
                    const tableCrawling = new Object();
                    // eslint-disable-next-line id-length
                    const $ = cheerio.load(html.data);
                    const tableLength = $(
                        '#menu4123_obj242 > div.profile._fnctWrap > form > ul > li'
                    ).length;
                    // console.log(tableLength);
                    /* 사진, 이름, 정보를 각각 추출 및 DB에 저장*/
                    for (let index = 1; index <= tableLength; index++) {
                        tableCrawling[index] = {
                            'img': $(
                                '#menu4123_obj242 > div.profile._fnctWrap > form > ul > li:nth-child(' +
                                index + ') > div.thumb > div > img'
                            )
                                .attr('src')
                                .replace(/^/, 'https://www.sungkyul.ac.kr'),
                            'name': $(
                                '#menu4123_obj242 > div.profile._fnctWrap > form > ul > li:nth-child(' +
                                index + ') > div.info > dl:nth-child(1) > dd                            '
                            )
                                .text()
                                .trim(),
                            'info': $(
                                '#menu4123_obj242 > div.profile._fnctWrap > form > ul > li:nth-child(' +
                                index + ') > div.info > dl:nth-child(3)'
                            )
                                .text()
                                .replace(/\s/g, "")
                                .split('처')
                                .join('처: ') + $(
                                '#menu4123_obj242 > div.profile._fnctWrap > form > ul > li:nth-child(' +
                                index + ') > div.info > dl:nth-child(4)'
                            )
                                .text()
                                .replace(/\s/g, "")
                                .split('실')
                                .join('실: ')
                                .replace(/^/, '\n')
                        };
                    }
                    // console.log(tableCrawling);
                    await admin
                        .database()
                        .ref('facultyIntroduction/')
                        .set(tableCrawling);
                    console.log('facultyIntroduction DB input Success');
                    /* 개발 모드에는 mocha 테스트 코드 실행을 위해 결과 값을 함께 전송 */
                    /* 배포 모드에는 성공 상태 코드만 전송 */
                    if (process.env.NODE_ENV === 'development') {
                        res
                            .status(201)
                            .send(tableCrawling);
                    } else {
                        res.sendStatus(201);
                    }
                })
                .catch(err => {
                    console.error('Error from facultyIntroduction : ', err);
                    res.sendStatus(err.response.status);
                });
        } else {
            console.error('No have key');
            res.sendStatus(400);
        }
    });