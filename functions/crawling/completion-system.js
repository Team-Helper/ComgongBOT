const functions = require('firebase-functions');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');

const option = {
    timeoutSeconds: 60,
    memory: '512MB'
}; // puppteer를 쓰기 위한 HTTP functions 옵션 값 set

exports.completionSystem = functions
    .runWith(option)
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        // console.log(req.body.admin);
        /* 어드민 인증 key 값이 있는지 요청 상태 인지를 확인해 크롤링 실행 혹은 미실행 */
        if (req.body.admin === functions.config().service_key.admin) {
            try {
                const browser = await puppeteer.launch({
                    // headless: false
                    args: ['--no-sandbox', '--disable-setuid-sandbox', "--disable-gpu", "--disable-dev-shm-usage"]
                }); // firebase cli 환경에 puppeteer를 작동하기 위한 조건 설정의 args (args를 주석처리 하고, headless 주석처리 해지 시 gui 환경의 puppeteer 사용 설정)
                const page = await browser.newPage();
                await page.setDefaultNavigationTimeout(0);
                await page.goto(
                    'https://www.sungkyul.ac.kr/sites/computer/index.do',
                    {waitUntil: "domcontentloaded"}
                ); // 학과 메인 페이지 주소로 이동
                /* 이수체계도 페이지 이동 및 추출하고자 하는 이미지 DOM 구간 지정*/
                await page.click('#menu4053_obj37 > div > a.a_2');
                await page.waitForSelector('#pagetitle2 > button');
                await page.click('#pagetitle2 > button');
                await page.waitForSelector('#pagetitle2 > ul > li:nth-child(3) > a');
                await page.click('#pagetitle2 > ul > li:nth-child(3) > a');
                await page.waitForSelector('#_contentBuilder');
                const images = await page.evaluate(
                    // eslint-disable-next-line id-length
                    () => Array.from(document.images, e => e.src)
                ); // 해당 이미지 태그 값 전체 추출
                // console.log(images);
                /* 올해 이수체계도 이름의 이미지 파일로 DB에 저장 */
                const year = new Date().getFullYear();
                const imgSet = new Object;
                let count = 0;
                for (let index = 0; index < images.length; index++) {
                    const imgURL = images[index];
                    if (imgURL.indexOf(year) > -1) {
                        imgSet[count] = {
                            'imgAlt': year + "년도 교과과정",
                            'imgURL': imgURL
                        };
                        count += 1;
                    }
                }
                // console.log(imgSet);
                await browser.close();

                await admin
                    .database()
                    .ref('completionSystem/')
                    .set(imgSet);
                console.log('Crawling and completionSystem DB input Success');
                /* 개발 모드에는 mocha 테스트 코드 실행을 위해 결과 값을 함께 전송 */
                /* 배포 모드에는 성공 상태 코드만 전송 */
                if (process.env.NODE_ENV === 'development') {
                    res
                        .status(201)
                        .send(imgSet);
                } else {
                    res.sendStatus(201);
                }
            } catch (err) {
                console.error('Error from completionSystem : ', err);
                res.sendStatus(err.response.status);
            }
        } else {
            console.error('No have key');
            res.sendStatus(400);
        }
    });