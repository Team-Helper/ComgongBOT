const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");

exports.new_news = functions
    .region('asia-northeast1')
    .https
    .onRequest((req, res) => {
        axios
            .get('https://www.sungkyul.ac.kr/computer/4102/subview.do')
            .then(html => {
                const tableCrawling = new Object();
                const $ = cheerio.load(html.data);
                const tableSize = $(
                    '#menu4102_obj257 > div._fnctWrap > form:nth-child(2) > div > table > tbody > tr'
                ).length - 4;

                for (let index = 1; index < tableSize; index++) {
                    tableCrawling[index] = {
                        'title': $(
                            '#menu4102_obj257 > div._fnctWrap > form:nth-child(2) > div > table > tbody > ' +
                            'tr:nth-child(' + index +') > td.td-subject'
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
                    .ref('notice/')
                    .set(result);
                console.log('new_news DB input Success');
                res
                    .status(201)
                    .json(result);
            })
            .catch(error => {
                console.error('Error from new_news : ', error);
            });
    });