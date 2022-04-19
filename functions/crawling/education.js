const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.education = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4104/subview.do') // 외부 행사 및 교육 페이지 주소
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);
                /*게시물의 이름, 날짜, 주소를 각각 추출 및 오브젝트 변수에 저장*/
                for (let index = 1; index <= 5; index++) {
                    tableCrawling[index] = {
                        'title': $(
                            '#menu4104_obj259 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-subject > a > strong'
                        )
                            .text()
                            .trim(),
                        'date': $(
                            '#menu4104_obj259 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-date'
                        )
                            .text()
                            .trim(),
                        'url': $(
                            '#menu4104_obj259 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-subject > a'
                        )
                            .attr('href')
                            .replace(/^/, 'https://www.sungkyul.ac.kr')
                    };
                }
                // console.log(tableCrawling);
                return tableCrawling; // 오브젝트 변수 반환
            })
            .then(async (result) => {
                // console.log(result);
                await admin
                    .database()
                    .ref('education/')
                    .set(result); // 반환된 변수를 DB에 저장
                console.log('education DB input Success');
                res.sendStatus(201); // 성공 코드 전송
            })
            .catch(error => {
                console.error('Error from education : ', error);
                res.sendStatus(error.response.status); // 에러 코드 전송
            });
    });