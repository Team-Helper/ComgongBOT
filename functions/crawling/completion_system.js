const functions = require('firebase-functions');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');

const option = {
    timeoutSeconds: 60,
    memory: '512MB'
} // puppteer를 쓰기 위한 HTTP functions 옵션 값 set

exports.completionSystem = functions // 크롤링 함수 이름
    .runWith(option)
    .region('asia-northeast1')
    .pubsub
    .schedule('0 0 1 * *') // 1달 단위로 작동
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        try {
            const browser = await puppeteer.launch({
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
            await page.waitForSelector('#pagetitle2 > ul > li:nth-child(3) > a')
            await page.click('#pagetitle2 > ul > li:nth-child(3) > a')
            await page.waitForSelector('#menu5563_obj326 > div:nth-child(1) > img');
            const getUrl = await page.$eval(
                '#menu5563_obj326 > div:nth-child(1) > img',
                e => e.getAttribute("src")
            ); // 이미지 주소 추출
            const imgUrl = getUrl.replace(/^/, 'https://www.sungkyul.ac.kr'); // 추출 주소 앞부분에 성결 도메인 추가
            // console.log(imgUrl);
            await browser.close();
            
            admin
                .database()
                .ref('completionSystem/')
                .set({imgUrl: imgUrl}); // 주소를 DB에 저장
            console.log('Crawling and completionSystem DB input Success');
        } catch (error) {
            console.error('Error from completionSystem : ', error);
        }
        return null;
    });