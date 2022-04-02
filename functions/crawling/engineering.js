const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.engineering = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .pubsub
    .schedule('0 0 1 * *') // 1달 단위로 작동
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4100/subview.do') // 공학인증 자료실 주소
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);

                for (let index = 1; index <= 5; index++) { // 게시물의 이름, 날짜, 주소를 각각 추출 및 오브젝트 변수에 저장
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
                    }

                }

                return tableCrawling;
            })
            .then(async (result) => {
                await admin
                    .database()
                    .ref('engineering/')
                    .set(result); // 오브젝트 변수를 DB에 저장
                console.log('engineering DB input Success');
            })
            .catch(error => {
                console.error('Error from engineering : ', error);
            });
        return null;
    });