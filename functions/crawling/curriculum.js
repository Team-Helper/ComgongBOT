const functions = require('firebase-functions');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');

const option = {
    timeoutSeconds: 60,
    memory: '512MB'
}

exports.curriculum = functions // 크롤링 함수 이름
    .runWith(option)
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        try {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto(
                'https://www.sungkyul.ac.kr/computer/4093/subview.do',
                {waitUntil: "domcontentloaded"}
            );
            await page.waitForSelector('#menu4093_obj250 > div._fnctWrap > iframe');
            console.log('iframe is ready. Loading iframe content');
            const element = await page.$('#menu4093_obj250 > div._fnctWrap > iframe');
            const frame = await element.contentFrame();
            const info = await frame.$eval(
                'body > #wrap > #container > #contents > #contents-area > #page-area0 > img',
                e => e.getAttribute("src")
            );
            console.log(info);
            await browser.close();
            console.log('Crawling success');
            res.end();
        } catch (error) {
            console.error('Error from curriculum : ', error);
        }
    });