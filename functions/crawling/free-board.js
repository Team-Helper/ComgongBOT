const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.freeBoard = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4108/subview.do') // 자유게시판 페이지 주소
            .then(async (html) => {
                const tableCrawling = new Object();
                // eslint-disable-next-line id-length
                const $ = cheerio.load(html.data);
                /* 게시물의 이름, 날짜, 주소를 각각 추출 및 오브젝트 변수에 저장*/
                for (let index = 1; index <= 5; index++) {
                    tableCrawling[index] = {
                        'title': $(
                            '#menu4108_obj261 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-subject > a > strong'
                        )
                            .text()
                            .trim(),
                        'date': $(
                            '#menu4108_obj261 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-date'
                        )
                            .text()
                            .trim(),
                        'url': $(
                            '#menu4108_obj261 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-subject > a'
                        )
                            .attr('href')
                            .replace(/^/, 'https://www.sungkyul.ac.kr')
                    };
                }
                // console.log(tableCrawling);
                await admin
                    .database()
                    .ref('freeBoard/')
                    .set(tableCrawling); // 오브젝트 변수를 DB에 저장
                console.log('freeBoard DB input Success');
                // res.status(201).send(tableCrawling);
                res.sendStatus(201); // 성공 코드 전송
            })
            .catch(err => {
                console.error('Error from freeBoard : ', err);
                res.sendStatus(err.response.status); // 에러 코드 전송
            });
    });