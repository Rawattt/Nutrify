const router = require('express').Router();
const { home, signin, signup } = require('../controller/basic');
const { isLoggedIn } = require('../middleware/auth');

router.get('/', isLoggedIn, home);
router.get('/signin', isLoggedIn, signin);
router.get('/signup', isLoggedIn, signup);
module.exports = router;
