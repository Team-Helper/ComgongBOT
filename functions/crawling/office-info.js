const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.officeInfo = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        // console.log(req.body.admin);
        if (req.body.admin === functions.config().service_key.admin) { // 크롤링 실행에 앞서 특정 key 값이 있는 요청인 경우
            axios
                .get('https://www.sungkyul.ac.kr/sites/computer/index.do') // 학과 메인 페이지 주소
                .then(async (html) => {
                    // eslint-disable-next-line id-length
                    const $ = cheerio.load(html.data);
                    /* 학과 사무실 위치, 전화번호를 각각 추출 및 오브젝트 변수에 저장*/
                    const tableCrawling = {
                        'address': $(
                            'body > footer > div.footer_info > div > div > address > span:nth-child(1)'
                        )
                            .text()
                            .replace('[14097] 경기도 안양시 만안구 성결대학로53', '')
                            .trim(),
                        'tel': $(
                            'body > footer > div.footer_info > div > div > address > span:nth-child(3)'
                        )
                            .text()
                            .trim()
                    };
                    // console.log(tableCrawling);
                    await admin
                        .database()
                        .ref('officeInfo/')
                        .set(tableCrawling); // 오브젝트 변수를 DB에 저장
                    console.log('officeInfo DB input Success');
                    // res.status(201).send(tableCrawling);
                    res.sendStatus(201); // 성공 코드 전송
                })
                .catch(err => {
                    console.error('Error from officeInfo : ', err);
                    res.sendStatus(err.response.status); // 에러 코드 전송
                });
        } else { // 특정 key 값이 없는 요청인 경우
            console.error('No have key');
            res.sendStatus(400);
        }
    });