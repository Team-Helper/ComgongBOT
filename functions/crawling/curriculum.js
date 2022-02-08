const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.curriculum = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4093/subview.do') // 크롤링 할 웹 주소
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);
                const iframe = $('#menu4093_obj250 > div._fnctWrap > iframe');
                const iframeUrl = iframe.attr('src').replace(/^/, 'https://www.sungkyul.ac.kr');
                console.log(iframeUrl);
                res.end();
                // console.log(tableCrawling);
                // return tableCrawling;
            })
            // .then(async (result) => {
            //     // console.log(result);
            //     await admin
            //         .database()
            //         .ref('notice/') // DB key 값 input
            //         .set(result);
            //     console.log('notice DB input Success');
            //     res
            //         .status(201)
            //         .json(result);
            // })
            .catch(error => {
                console.error('Error from notice : ', error);
            });
    });