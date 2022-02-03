const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.notice = functions
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4101/subview.do')
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);
                const tableSize = $(
                    '#menu4101_obj256 > div._fnctWrap > form:nth-child(2) > div > table > tbody> tr'
                ).length - 4;
                // console.log(tableSize);
                for (let index = 1; index < tableSize; index++) {
                    tableCrawling[index] = {
                        'title': $(
                            '#menu4101_obj256 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-subject'
                        )
                            .text()
                            .trim(),
                        'date': $(
                            '#menu4101_obj256 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-date'
                        )
                            .text()
                            .trim(),
                        'url': $(
                            '#menu4101_obj256 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t' +
                            'r:nth-child(' + index + ') > td.td-subject > a'
                        )
                            .attr('href')
                            .replace(/^/, 'https://www.sungkyul.ac.kr')
                    }

                }
                // console.log(tableCrawling);
                return tableCrawling;
            })
            .then(async (result) => {
                // console.log(result);
                await admin
                    .database()
                    .ref('notice/')
                    .set(result);
                console.log('notice DB input Success');
                res
                    .status(201)
                    .end();
            })
            .catch(error => {
                console.error('Error from notice : ', error);
            });
    });