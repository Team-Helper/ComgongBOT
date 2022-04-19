const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.facultyIntroduction = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .pubsub
    .schedule('0 0 1 * *') // 1달 단위로 작동
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4123/subview.do') // 교수진 소개 페이지 주소
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);
                const tableLength = $(
                    '#menu4123_obj242 > div.profile._fnctWrap > form > ul > li'
                ).length;
                // console.log(tableLength);
                /*사진, 이름, 정보를 각각 추출 및 오브젝트 변수에 저장*/
                for (let index = 1; index <= tableLength; index++) {
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
                            index + ') > div.info > dl:nth-child(3)'
                        )
                            .text()
                            .replace(/\s/g, "")
                            .split('처')
                            .join('처: ') + $(
                            '#menu4123_obj242 > div.profile._fnctWrap > form > ul > li:nth-child(' +
                            index + ') > div.info > dl:nth-child(4)'
                        )
                            .text()
                            .replace(/\s/g, "")
                            .split('실')
                            .join('실: ')
                            .replace(/^/, '\n')
                    };
                }
                // console.log(tableCrawling);
                return tableCrawling; // 오브젝트 변수 반환
            })
            .then(async (result) => {
                // console.log(result);
                await admin
                    .database()
                    .ref('facultyIntroduction/')
                    .set(result); // 반환된 변수를 DB에 저장
                console.log('facultyIntroduction DB input Success');
            })
            .catch(error => {
                console.error('Error from facultyIntroduction : ', error);
            });
        return null;
    });