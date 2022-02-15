const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.notice = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4101/subview.do') // 크롤링 할 웹 주소
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);

                for (let index = 1; index <= 5; index++) {
                    tableCrawling[index] = {
                        'title': $(
                            '#menu4101_obj256 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-subject > a > strong'
                        )
                            .text()
                            .trim(), // 게시물 제목 DOM selector
                        'date': $(
                            '#menu4101_obj256 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-date'
                        )
                            .text()
                            .trim(), // 게시물 업로드 날짜 DOM selector
                        'url': $(
                            '#menu4101_obj256 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-subject > a'
                        )
                            .attr('href')
                            .replace(/^/, 'https://www.sungkyul.ac.kr') // 게시물 웹 주소 DOM selector
                    }

                }
                // console.log(tableCrawling);
                return tableCrawling;
            })
            .then(async (result) => {
                // console.log(result);
                await admin
                    .database()
                    .ref('notice/') // DB key 값 input
                    .set(result);
                console.log('notice DB input Success');
                res
                    .status(201)
                    .json(result);
            })
            .catch(error => {
                console.error('Error from notice : ', error);
            });
    });