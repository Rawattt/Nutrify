const User = require('../models/user');
const HttpError = require('../utils/error');
const errorHandler = require('../utils/errorHandler');

// @desc      Sign in admin
// @route     Get /admin/signin
// @access    Public
exports.adminSigninGet = async (req, res) => {
  try {
    res.render('adminSignin');
  } catch (error) {
    errorHandler(error);
  }
};

// @desc      Sign in admin
// @route     POST /admin/signin
// @access    Private
exports.adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new HttpError('Please fill all fields', 400);

    const user = await User.verifyCredentials(email, password);

    if (!user.isAdmin) throw new HttpError('You do not have permission', 400);

    const user_data = user.toJSON();

    res.session.user_id = user_data._id;
    res.session.isAdmin = true;

    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    errorHandler(error);
  }
};

// @desc      Sign out admin
// @route     POST /admin/signout
// @access    Private
exports.adminSignout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      res.clearCookie(process.env.NAME);

      res.redirect('/admin/signin');
    });
  } catch (error) {
    errorHandler(error);
  }
};

// @desc      delete user
// @route     DELETE /admin/user/:id
// @access    Private
exports.adminDeleteUser = async (req, res) => {
  try {
    if (!req.params.id) throw new HttpError('Please provide user id', 401);
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    errorHandler(error);
  }
};

// @desc      edit user
// @route     POST /admin/user/edit/:username
// @access    Private
exports.adminEditUser = async (req, res) => {
  try {
    if (!req.params.username)
      throw new HttpError('Please provide a username', 401);
    const { name, username, email, password, calories_per_day } = req.body;
    const user = await User.findOneAndUpdate(
      { username },
      {
        name,
        username,
        email,
        password,
        calories_per_day
      }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    errorHandler(error);
  }
};

// @desc      delete meal
// @route     DELETE /admin/meal/delete/:username/:meal_id
// @access    Private
exports.adminDeleteMeal = async (req, res) => {
  try {
    let { username, meal_id } = req.params;
    if (!username || !meal_id) throw new HttpError('Invalid request', 401);
    const data = await User.findOneAndUpdate(username, {
      $pull: {
        meal: { _id: new mongoose.Types.ObjectId(meal_id) }
      }
    });
    res.status(200).json({ success: true, message: 'Meal deleted', data });
  } catch (error) {
    errorHandler(error);
  }
};

// @desc    Edit a meal of a user
// @route   POST /admin/meal/edit/:username/:meal_id
// @access  private
exports.adminEditMeal = async (req, res) => {
  try {
    const { username, meal_id } = req.params;
    const { food_name, description, calories } = req.body;

    // Check if any field is empty
    if (!food_name || !description || !calories)
      throw new HttpError('Please fill all the fields', 400);

    // Update the meal
    await User.updateOne(
      {
        username,
        'meal._id': meal_id
      },
      {
        $set: {
          'meal.$.food_name': food_name,
          'meal.$.description': description,
          'meal.$.calories': calories
        }
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    errorHandler(res, error);
  }
};
