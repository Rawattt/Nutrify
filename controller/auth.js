const User = require('../models/user');
const HttpError = require('../utils/error');
const errorHandler = require('../utils/errorHandler');
const successHandler = require('../utils/successHandler');

// @desc      Register user
// @route     POST /api/v1/auth/signup
// @access    Public
exports.userSignup = async (req, res) => {
  try {
    const { name, email, username, password, calories_per_day } = req.body;

    //     Check if username already exists
    let checkUsername = await User.findOne({ username });
    if (checkUsername) {
      throw new HttpError(
        'Username is taken. Please try a different username',
        400
      );
    }

    //     Check if email is already registered
    let checkEmail = await User.findOne({ email });
    if (checkEmail) {
      throw new HttpError('Email already exists', 400);
    }

    //     Create user
    const user = new User({
      name,
      email,
      username,
      password,
      calories_per_day
    });

    await user.save();
    req.session.user_id = user._id;
    res.redirect('/user/dashboard');

    //     Remove password
    // const user_data = await user.toJSON();
    // successHandler(res, '/user/dashboard', user_data);
    // res.status(201).json({ message: 'user created', user_data });
  } catch (error) {
    console.log(error);
    res.render('signup', { error: true, message: error.message });
    // errorHandler(res, error);
  }
};

// @desc      Sign in user
// @route     POST /api/v1/auth/signin
// @access    Public
exports.userSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new HttpError('Please fill all the fields', 400);

    const user = await User.verifyCredentials(email, password);

    req.session.user_id = user._id;

    res.redirect('/user/dashboard');
  } catch (error) {
    res.render('signin', { message: 'Invalid email or password' });
    // errorHandler(res, error);
  }
};

// @desc      Sign out user
// @route     POST /api/v1/auth/signout
// @access    Private
exports.userSignout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      res.clearCookie();

      res.redirect('/');
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
