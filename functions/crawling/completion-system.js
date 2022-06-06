const functions = require('firebase-functions');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');

const option = {
    timeoutSeconds: 60,
    memory: '512MB'
}; // puppteer를 쓰기 위한 HTTP functions 옵션 값 set

exports.completionSystem = functions // 크롤링 함수 이름
    .runWith(option)
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        console.log(req);
        try {
            const browser = await puppeteer.launch({
                // headless: false
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // Firebase cli 환경에서 돌아가기 위한 조건 설정
            });
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto(
                'https://www.sungkyul.ac.kr/sites/computer/index.do',
                {waitUntil: "domcontentloaded"}
            ); // 이수체계도 주소로 이동
            await page.click('#menu4053_obj37 > div > a.a_2');
            await page.waitForSelector('#pagetitle2 > button');
            await page.click('#pagetitle2 > button');
            await page.waitForSelector('#pagetitle2 > ul > li:nth-child(3) > a');
            await page.click('#pagetitle2 > ul > li:nth-child(3) > a');
            await page.waitForSelector('#_contentBuilder');
            const images = await page.evaluate(
                // eslint-disable-next-line id-length
                () => Array.from(document.images, e => e.src)
            ); // 해당 dom 구간의 이미지 태그 값 전체 추출
            // console.log(images);
            const year = new Date().getFullYear(); // 올해 년도
            const imgSet = new Object;
            let count = 0;

            for (let index = 0; index < images.length; index++) {
                const imgURL = images[index];
                if (imgURL.indexOf(year) > -1) {
                    imgSet[count] = {
                        'imgAlt': year + "년도 교과과정",
                        'imgURL': imgURL
                    }; // 올해 년도 이름의 이미지 파일을 객체에 저장
                    count += 1;
                }
            }
            // console.log(imgSet);
            await browser.close();

            await admin
                .database()
                .ref('completionSystem/')
                .set(imgSet); // 배열 처리된 이미지 주소를 DB에 저장
            console.log('Crawling and completionSystem DB input Success');
            // res.status(201).send(imgSet);
            res.sendStatus(201); // 성공 코드 전송
        } catch (err) {
            console.error('Error from completionSystem : ', err);
            res.sendStatus(err.response.status); // 에러 코드 전송
        }
    });