const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.newNews = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        // console.log(req.body.admin);
        /* 어드민 인증 key 값이 있는지 요청 상태 인지를 확인해 크롤링 실행 혹은 미실행 */
        if (req.body.admin === functions.config().service_key.admin) {
            axios
                .get('https://www.sungkyul.ac.kr/computer/4102/subview.do') // 새소식 페이지 주소
                .then(async (html) => {
                    const tableCrawling = new Object();
                    // eslint-disable-next-line id-length
                    const $ = cheerio.load(html.data);
                    /* 게시물의 이름, 날짜, 주소를 각각 추출 및 DB에 저장 */
                    for (let index = 1; index <= 5; index++) {
                        tableCrawling[index] = {
                            'title': $(
                                '#menu4102_obj257 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                                'r:nth-child(' + index + ') > td.td-subject > a > strong'
                            )
                                .text()
                                .trim(),
                            'date': $(
                                '#menu4102_obj257 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                                'r:nth-child(' + index + ') > td.td-date'
                            )
                                .text()
                                .trim(),
                            'url': $(
                                '#menu4102_obj257 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                                'r:nth-child(' + index + ') > td.td-subject > a'
                            )
                                .attr('href')
                                .replace(/^/, 'https://www.sungkyul.ac.kr')
                        };
                    }
                    // console.log(tableCrawling);
                    await admin
                        .database()
                        .ref('newNews/')
                        .set(tableCrawling);
                    console.log('newNews DB input Success');
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
                    console.error('Error from newNews : ', err);
                    res.sendStatus(err.response.status);
                });
        } else {
            console.error('No have key');
            res.sendStatus(400);
        }
    });