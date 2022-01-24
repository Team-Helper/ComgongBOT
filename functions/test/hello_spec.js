const request = require('supertest');
const {expect} = require('chai');
const app = require('../index');

function sum(a, b) {
    return a + b;
}

describe('Equal Test', () => {
    it("4 + 5 = 9", () => {
        console.log(app);
        //equal
        expect(sum(4, 5))
            .to
            .equal(9);
    });
});

describe('GET /', () => {
    it('responds with text', done => {
        request(app)
            .get('/')
            .expect(200)
            .then(res => {
                expect(res.text)
                    .to
                    .equal('Hello from Firebase!');
                done();
            })
            .catch(err => {
                console.error("######Error >>", err);
                done(err);
            })
        });
});