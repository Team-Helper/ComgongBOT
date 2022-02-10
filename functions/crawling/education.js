const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.education = functions
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4104/subview.do')
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);
                const tableSize = $(
                    '#menu4104_obj259 > div._fnctWrap > form:nth-child(2) > div > table > tbody > tr'
                ).length - 4;

                for (let index = 1; index < tableSize; index++) {
                    tableCrawling[index] = {
                        'title': $(
                            '#menu4104_obj259 > div._fnctWrap > form:nth-child(2) > div > table > tbody > ' +
                            'tr:nth-child(' + index + ') > td.td-subject > a > strong'
                        )
                            .text()
                            .trim(),
                        'date': $(
                           '#menu4104_obj259 > div._fnctWrap > form:nth-child(2) > div > table > tbody > ' +
                           'tr:nth-child(' + index + ') > td.td-date'
                        )
                            .text()
                            .trim(),
                        'url': $(
                            '#menu4104_obj259 > div._fnctWrap > form:nth-child(2) > div > table > tbody > ' +
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
                    .ref('education/')
                    .set(result);
                console.log('education DB input Success');
                res
                    .status(201)
                    .json(result);
            })
            .catch(error => {
                console.error('Error from education : ', error);
            });
    });