const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.officeInfo = functions // 크롤링 함수 이름
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        // console.log(req.body.admin);
        /* 어드민 인증 key 값이 있는지 요청 상태 인지를 확인해 크롤링 실행 혹은 미실행 */
        if (req.body.admin === functions.config().service_key.admin) {
            axios
                .get('https://www.sungkyul.ac.kr/sites/computer/index.do') // 학과 메인 페이지 주소
                .then(async (html) => {
                    // eslint-disable-next-line id-length
                    const $ = cheerio.load(html.data);
                    /* 학과 사무실 위치, 전화번호를 각각 추출 및 DB에 저장*/
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
                        .set(tableCrawling);
                    console.log('officeInfo DB input Success');
                    /* 개발 모드에는 mocha 테스트 코드 실행을 위해 결과 값을 함께 전송 */
                    /* 배포 모드에는 성공 상태 코드만 전송 */
                    if (process.env.NODE_ENV === 'development') {
                        res
                            .status(201)
                            .send(tableCrawling);
                    } else {
                        res.sendStatus(201);
                    }
                })
                .catch(err => {
                    console.error('Error from officeInfo : ', err);
                    res.sendStatus(err.response.status);
                });
        } else {
            console.error('No have key');
            res.sendStatus(400);
        }
    });