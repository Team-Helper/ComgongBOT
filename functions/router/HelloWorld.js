const functions = require('firebase-functions');
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    functions
        .logger
        .info("Hello logs!!!", {structuredData: true});
    res.send("Hello from Firebase!");
});

module.exports = router;