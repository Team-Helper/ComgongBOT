const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.newNews = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4102/subview.do') // 새소식 페이지 주소
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);

                for (let index = 1; index <= 5; index++) { // 게시물의 이름, 날짜, 주소를 각각 추출 및 오브젝트 변수에 저장
                    tableCrawling[index] = {
                        'title': $(
                            '#menu4102_obj257 > div._fnctWrap > form:nth-child(2) > div > table > tbody > ' +
                            'tr:nth-child(' + index + ') > td.td-subject > a > strong'
                        )
                            .text()
                            .trim(),
                        'date': $(
                           '#menu4102_obj257 > div._fnctWrap > form:nth-child(2) > div > table > tbody > ' +
                            'tr:nth-child(' + index + ') > td.td-date'
                        )
                            .text()
                            .trim(),
                        'url': $(
                            '#menu4102_obj257 > div._fnctWrap > form:nth-child(2) > div > table > tbody > ' +
                            'tr:nth-child(' + index + ') > td.td-subject > a'
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
                    .ref('newNews/')
                    .set(result); // 오브젝트 변수를 DB에 저장
                console.log('newNews DB input Success');
                res
                    .status(201)
                    .json(result);
            })
            .catch(error => {
                console.error('Error from newNews : ', error);
            });
    });