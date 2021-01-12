const mongoose = require('mongoose');
const User = require('../models/user');
const HttpError = require('../utils/error');
const errorHandler = require('../utils/errorHandler');

// @desc      Create a meal
// @route     POST /meal/add
// @access    Private
exports.createMeal = async (req, res) => {
  try {
    const user = await User.findById(req.session.user_id);

    //     Check if calories is 0 or less
    if (req.body.calories <= 0)
      throw new HttpError('Please make calories more than 0');

    const datetime = new Date().getTime();
    const _id = `${user._id.toString()}${datetime}`;
    const { food_name, description, calories } = req.body;

    //     Add meal to the user data
    user.meal.push({ _id, food_name, description, calories, datetime });
    await user.save();

    res.redirect('/user/dashboard');
  } catch (error) {
    errorHandler(res, error);
  }
};

// @desc      Get all the meals
// @route     GET /meal/:date?query
// @access    Private
exports.getMeals = async (req, res) => {
  try {
    const { sortBy, order } = req.query;

    let sort_value,
      sort_order = 1;
    if (sortBy === 'date') {
      sort_value = 'datetime';
    } else if (sortBy === 'calories') {
      sort_value = 'calories';
    }
    if (order === 'desc') {
      sort_order = -1;
    }
    let dates = getDates(req.params.date);
    let meal = [...req.user.meal];

    //  Filter the meals by date
    meal = meal.filter(
      (food) => food.datetime >= dates[0] && food.datetime < dates[1]
    );

    // Sort the meals
    if (sortBy) {
      meal = meal.sort(
        (a, b) => sort_order * a[sort_value] - sort_order * b[sort_value]
      );
    }

    res.status(200).json({ success: true, data: { ...req.user, meal } });
  } catch (error) {
    errorHandler(res, error);
  }
};

// @desc    Edit a meal of the logged in user
// @route   POST /meal/edit/:meal_id
// @access  private
exports.editMeal = async (req, res) => {
  try {
    let { food_name, description, calories } = req.body;
    // Check if any field is empty
    if (!food_name || !description || !calories)
      throw new HttpError('Please fill all the fields', 400);

    calories = parseInt(calories);
    // Update the meal
    await User.updateOne(
      {
        _id: new mongoose.Types.ObjectId(req.session.user_id),
        'meal._id': req.params.id
      },
      {
        $set: {
          'meal.$.food_name': food_name,
          'meal.$.description': description,
          'meal.$.calories': calories
        }
      }
    );

    res.json({ success: true });
    // res.redirect('/user/dashboard');
    // const user = await User.findById(req.user._id);
    // user_data = await user.toJSON();
    // res.status(200).json({ success: true, data: user_data });
  } catch (error) {
    errorHandler(res, error);
  }
};

// @desc    deletes a meal of the logged in user
// @route   POST /meal/delete/:meal_id
// @access  private
exports.deleteMeal = async (req, res) => {
  try {
    const meal_id = req.params.id;
    const user = await User.findByIdAndUpdate(
      req.session.user_id,
      {
        $pull: {
          meal: { _id: meal_id }
        }
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    errorHandler(res, error);
  }
};

// @desc        Return start and end date in format of YYYY-MM-DD
// @parameter   start: string
const getDates = (start) => {
  if (!start) {
    start_date = new Date().setHours(0, 0, 0, 0);
  } else {
    if (start.length != 10) throw new HttpError('Invalid date', 400);
    start_date = new Date(start).setHours(0, 0, 0, 0);
  }

  let end_date = new Date(start_date + 1000 * 60 * 60 * 24);
  // Convert date in format in YYYY-MM-DD
  return [start_date, end_date.getTime()];
};
