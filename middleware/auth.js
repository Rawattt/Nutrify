const User = require('../models/user');
const errorHandler = require('../utils/errorHandler');

// @desc      Redirect to the dashboard if user is already logged in
// @redirect  User dashboard
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.session.user_id) return res.redirect('/user/dashboard');

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

// @desc       Protection for the private route of normal user
// @redidrect  Home page
exports.verifyUser = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/');
    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

// @desc      Protection for the admin routes
// @redirect  Normal Signin page
exports.isAdmin = async (req, res, next) => {
  if (req.session.user_id && !req.session.isAdmin)
    return res.redirect('/user/dashboard');
  if (!req.session.user_id || !req.session.isAdmin)
    return res.redirect('/signin');
  next();
};
