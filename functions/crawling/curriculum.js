const functions = require('firebase-functions');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');

const option = {
    timeoutSeconds: 60,
    memory: '512MB'
}; // puppteer를 쓰기 위한 HTTP functions 옵션 값 set

exports.curriculum = functions
    .runWith(option)
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        // console.log(req.body.admin);
        /* 어드민 인증 key 값이 있는지 요청 상태 인지를 확인해 크롤링 실행 혹은 미실행 */
        if (req.body.admin === functions.config().service_key.admin) {
            try {
                const browser = await puppeteer.launch({
                    // headless : false
                    args: ['--no-sandbox', '--disable-setuid-sandbox', "--disable-gpu", "--disable-dev-shm-usage"]
                }); // firebase cli 환경에 puppeteer를 작동하기 위한 조건 설정의 args (args를 주석처리 하고, headless 주석처리 해지 시 gui 환경의 puppeteer 사용 설정)
                const page = await browser.newPage();
                await page.setDefaultNavigationTimeout(0);
                await page.goto(
                    'https://www.sungkyul.ac.kr/computer/4093/subview.do',
                    {waitUntil: "domcontentloaded"}
                ); // 교과과정 페이지 주소로 이동
                /* 추출하고자 하는 이미지 DOM 구간으로 이동을 위해 iframe 렌더링 이후 작업 진행 */
                await page.waitForSelector('#menu4093_obj250 > div._fnctWrap > iframe');
                console.log('iframe is ready. Loading iframe content');
                const element = await page.$('#menu4093_obj250 > div._fnctWrap > iframe');
                const frame = await element.contentFrame();
                await frame.waitForSelector('#page0');
                // eslint-disable-next-line id-length
                const imgURL = await frame.$eval('#page0', e => e.getAttribute("src")); // 추출하고자 하는 이미지 주소 추출
                // console.log(imgURL);
                await browser.close();

                await admin
                    .database()
                    .ref('curriculum/')
                    .set({imgURL: imgURL});
                console.log('Crawling and curriculum DB input Success');
                /* 개발 모드에는 mocha 테스트 코드 실행을 위해 결과 값을 함께 전송 */
                /* 배포 모드에는 성공 상태 코드만 전송 */
                if (process.env.NODE_ENV === 'development') {
                    res
                        .status(201)
                        .send(imgURL);
                } else {
                    res.sendStatus(201);
                }
            } catch (err) {
                console.error('Error from curriculum : ', err);
                res.sendStatus(err.response.status);
            }
        } else {
            console.error('No have key');
            res.sendStatus(400);
        }
    });