const router = require('express').Router();
const {
  adminSignin,
  adminSignout,
  adminDeleteUser,
  adminSigninGet,
  adminEditUser,
  adminDeleteMeal,
  adminEditMeal
} = require('../controller/admin');
const { isAdmin } = require('../middleware/auth');

router.post('/signin', isAdmin, adminSignin);
router.get('/signin', adminSigninGet);
router.post('/signout', isAdmin, adminSignout);
router.delete('/user/delete/:username', isAdmin, adminDeleteUser);
router.post('/user/edit/:username', isAdmin, adminEditUser);
router.post('/user/meal/edit/:username/:meal_id', isAdmin, adminDeleteMeal);
router.delete('/user/meal/delete/:username/:meal_id', isAdmin, adminEditMeal);

module.exports = router;
