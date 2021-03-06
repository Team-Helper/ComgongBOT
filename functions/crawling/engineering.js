const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.engineering = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        // console.log(req.body.admin);
        if (req.body.admin === functions.config().service_key.admin) { // 크롤링 실행에 앞서 특정 key 값이 있는 요청인 경우
            axios
                .get('https://www.sungkyul.ac.kr/computer/4100/subview.do') // 공학인증 자료실 주소
                .then(async (html) => {
                    const tableCrawling = new Object();
                    // eslint-disable-next-line id-length
                    const $ = cheerio.load(html.data);
                    /* 게시물의 이름, 날짜, 주소를 각각 추출 및 오브젝트 변수에 저장*/
                    for (let index = 1; index <= 5; index++) {
                        tableCrawling[index] = {
                            'title': $(
                                '#menu4100_obj255 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                                'r:nth-child(' + index + ') > td.td-subject > a > strong'
                            )
                                .text()
                                .trim(),
                            'date': $(
                                '#menu4100_obj255 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                                'r:nth-child(' + index + ') > td.td-date'
                            )
                                .text()
                                .trim(),
                            'url': $(
                                '#menu4100_obj255 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                                'r:nth-child(' + index + ') > td.td-subject > a'
                            )
                                .attr('href')
                                .replace(/^/, 'https://www.sungkyul.ac.kr')
                        };
                    }
                    // console.log(tableCrawling);
                    await admin
                        .database()
                        .ref('engineering/')
                        .set(tableCrawling); // 오브젝트 변수를 DB에 저장
                    console.log('engineering DB input Success');
                    // res.status(201).send(tableCrawling);
                    res.sendStatus(201); // 성공 코드 전송
                })
                .catch(err => {
                    console.error('Error from engineering : ', err);
                    res.sendStatus(err.response.status); // 에러 코드 전송
                });
        } else { // 특정 key 값이 없는 요청인 경우
            console.error('No have key');
            res.sendStatus(400);
        }
    });