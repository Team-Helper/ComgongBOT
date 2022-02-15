const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.newNews = functions
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4102/subview.do')
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);

                for (let index = 1; index <= 5; index++) {
                    tableCrawling[index] = {
                        'title': $(
                            '#menu4102_obj257 > div._fnctWrap > form:nth-child(2) > div > table > tbody > ' +
                            'tr:nth-child(' + index + ') > td.td-subject > a > strong'
                        )
                            .text()
                            .trim(),
                        'date': $(
                           '#menu4102_obj257 > div._fnctWrap > form:nth-child(2) > div > table > tbody > ' +
                            'tr:nth-child(' + index + ') > td.td-date'
                        )
                            .text()
                            .trim(),
                        'url': $(
                            '#menu4102_obj257 > div._fnctWrap > form:nth-child(2) > div > table > tbody > ' +
                            'tr:nth-child(' + index + ') > td.td-subject > a'
                        )
                            .attr('href')
                            .replace(/^/, 'https://www.sungkyul.ac.kr')
                    }
                
                }

                return tableCrawling;
            })
            .then(async (result) => {
                await admin
                    .database()
                    .ref('newNews/')
                    .set(result);
                console.log('newNews DB input Success');
                res
                    .status(201)
                    .json(result);
            })
            .catch(error => {
                console.error('Error from newNews : ', error);
            });
    });