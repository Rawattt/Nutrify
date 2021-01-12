const router = require('express').Router();
const {
  getMyProfile,
  getMeals,
  dashboard,
  dashboardSearch
} = require('../controller/user');
const { verifyUser } = require('../middleware/auth');

router.get('/dashboard', verifyUser, dashboard);
router.get('/dashboard/search', verifyUser, dashboardSearch);
router.get('/profile', verifyUser, getMyProfile);

module.exports = router;
