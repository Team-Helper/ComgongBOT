const functions = require('firebase-functions');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');

const option = {
    timeoutSeconds: 60,
    memory: '512MB'
}; // puppteer를 쓰기 위한 HTTP functions 옵션 값 set

exports.curriculum = functions // 크롤링 함수 이름
    .runWith(option)
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        // console.log(req.body.admin);
        if (req.body.admin === functions.config().service_key.admin) { // 크롤링 실행에 앞서 특정 key 값이 있는 요청인 경우
            try {
                const browser = await puppeteer.launch({
                    // headless : false
                    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Firebase cli 환경에서 돌아가기 위한 조건 설정
                });
                const page = await browser.newPage();
                await page.setDefaultNavigationTimeout(0);
                await page.goto(
                    'https://www.sungkyul.ac.kr/computer/4093/subview.do',
                    {waitUntil: "domcontentloaded"}
                ); // 교과과정 페이지 주소로 이동
                /* 추출하고자 하는 이미지 dom 구간으로 이동 */
                await page.waitForSelector('#menu4093_obj250 > div._fnctWrap > iframe');
                console.log('iframe is ready. Loading iframe content');
                const element = await page.$('#menu4093_obj250 > div._fnctWrap > iframe');
                const frame = await element.contentFrame();
                await frame.waitForSelector('#page0');
                // eslint-disable-next-line id-length
                const imgURL = await frame.$eval('#page0', e => e.getAttribute("src")); // 해당 이미지 주소 추출
                // console.log(imgURL);
                await browser.close();

                await admin
                    .database()
                    .ref('curriculum/')
                    .set({imgURL: imgURL}); // 주소를 DB에 저장
                console.log('Crawling and curriculum DB input Success');
                // res.status(201).send(imgURL);
                res.sendStatus(201); // 성공 코드 전송
            } catch (err) {
                console.error('Error from curriculum : ', err);
                res.sendStatus(err.response.status); // 에러 코드 전송
            }
        } else { // 특정 key 값이 없는 요청인 경우
            console.error('No have key');
            res.sendStatus(400);
        }
    });