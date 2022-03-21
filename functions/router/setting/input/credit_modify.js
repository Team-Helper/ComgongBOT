const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async function (req, res) {
    const userAbout = req.body.userRequest.user.properties;
    // console.log(userAbout.plusfriendUserKey, userAbout.isFriend);
    const userRequest = req.body.action.detailParams;
    console.log(userRequest);
    // const majorA = userRequest.majorA.value;
    // const majorB = userRequest.majorB.value;
    // const geA = userRequest.geA.value;
    // const geB = userRequest.geB.value;
    // const total = userRequest.total.value;
    // // console.log(majorA, majorB, geA, geB, total);

    // const firestore = admin.firestore();
    // const userSelect = firestore
    //     .collection('users')
    //     .doc(userAbout.plusfriendUserKey);
    
    res.send(201);
});

module.exports = router;