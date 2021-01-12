const express = require('express');
const router = new express.Router();
const { userSignup, userSignin, userSignout } = require('../controller/auth');
const { verifyUser } = require('../middleware/auth');

router.post('/signup', userSignup);
router.post('/signin', userSignin);
router.get('/signout', verifyUser, userSignout);

module.exports = router;
