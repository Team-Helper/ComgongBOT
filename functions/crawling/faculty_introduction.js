const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.facultyIntroduction = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4123/subview.do') // 크롤링 할 웹 주소
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);
                for (let index = 1; index <= 10; index++) {
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
                            index + ') > div.info'
                        )
                            .text()
                            .replace(/\t/g, "")
                    }

                }
                // console.log(tableCrawling);
                return tableCrawling;
            })
            .then(async (result) => {
                console.log(result);
                await admin
                    .database()
                    .ref('facultyIntroduction/')
                    .set(result);
                console.log('facultyIntroduction DB input Success');
                res
                    .status(201)
                    .json(result);
            })
            .catch(error => {
                console.error('Error from facultyIntroduction : ', error);
            });
    });