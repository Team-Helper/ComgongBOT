const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.notice = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4101/subview.do') // 공지사항 페이지 주소
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);
                /*게시물의 이름, 날짜, 주소를 각각 추출 및 오브젝트 변수에 저장*/
                for (let index = 1; index <= 5; index++) {
                    tableCrawling[index] = {
                        'title': $(
                            '#menu4101_obj256 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-subject > a > strong'
                        )
                            .text()
                            .trim(),
                        'date': $(
                            '#menu4101_obj256 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-date'
                        )
                            .text()
                            .trim(),
                        'url': $(
                            '#menu4101_obj256 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-subject > a'
                        )
                            .attr('href')
                            .replace(/^/, 'https://www.sungkyul.ac.kr')
                    };
                }
                // console.log(tableCrawling);
                return tableCrawling;
            })
            .then(async (result) => {
                // console.log(result);
                await admin
                    .database()
                    .ref('notice/') // 반환된 변수를 DB에 저장
                    .set(result);
                console.log('notice DB input Success');
                res.sendStatus(201); // 성공 코드 전송
            })
            .catch(error => {
                console.error('Error from notice : ', error);
                res.sendStatus(error.response.status); // 에러 코드 전송
            });
    });