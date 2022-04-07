const functions = require('firebase-functions');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');

const option = {
    timeoutSeconds: 60,
    memory: '512MB'
} // puppteer를 쓰기 위한 HTTP functions 옵션 값 set

exports.curriculum = functions // 크롤링 함수 이름
    .runWith(option)
    .region('asia-northeast1')
    .pubsub
    .schedule('0 0 1 * *') // 1달 단위로 작동
    .timeZone('Asia/Seoul')
    .onRun(async () => {
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
            ); // 교과과정 주소로 이동
            await page.waitForSelector('#menu4093_obj250 > div._fnctWrap > iframe');
            console.log('iframe is ready. Loading iframe content');
            const element = await page.$('#menu4093_obj250 > div._fnctWrap > iframe');
            const frame = await element.contentFrame();
            await frame.waitForSelector('#page0');
            const imgUrl = await frame.$eval('#page0', e => e.getAttribute("src")); // 이미지 주소 추출
            // console.log(imgUrl);
            await browser.close();

            admin
                .database()
                .ref('curriculum/')
                .set({imgUrl: imgUrl}); // 주소를 DB에 저장
            console.log('Crawling and curriculum DB input Success');
        } catch (error) {
            console.error('Error from curriculum : ', error);
        }
        return null;
    });