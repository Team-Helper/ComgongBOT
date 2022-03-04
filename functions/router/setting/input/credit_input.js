const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams;
    const requestObject = JSON.parse(userRequest);
    console.log(
        requestObject.majorA,
        requestObject.majorB,
        requestObject.geA,
        requestObject.geB,
        requestObject.total
    );

    res.send(200);
});

module.exports = router;