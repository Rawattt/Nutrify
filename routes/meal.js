const router = require('express').Router();
const {
  createMeal,
  getMeals,
  deleteMeal,
  editMeal
} = require('../controller/meal');
const { verifyUser } = require('../middleware/auth');

router.post('/add', verifyUser, createMeal);
// router.get('/', verifyUser, getMeals);
// router.get('/:date', verifyUser, getMeals);
router.post('/edit/:id', verifyUser, editMeal);
router.post('/delete/:id', verifyUser, deleteMeal);

module.exports = router;
