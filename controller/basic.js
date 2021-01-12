const errorHandler = require('../utils/errorHandler');

// @desc    Render landing page
// @route   /

exports.home = async (req, res) => {
  try {
    // await isAuthenticated(req, res);
    res.render('home');
  } catch (error) {
    errorHandler(error);
  }
};

// @desc    Render signup page
// @route   /signup

exports.signup = async (req, res) => {
  try {
    // await isAuthenticated(req, res);
    res.render('signup');
  } catch (error) {
    errorHandler(error);
  }
};

// @desc Render signin page
// @route   /signin

exports.signin = async (req, res) => {
  try {
    // await isAuthenticated(req, res);
    res.render('signin');
  } catch (error) {
    errorHandler(error);
  }
};

// @desc    Check if the user is already logged in

const isAuthenticated = async (req, res) => {
  try {
    //   Extract token from request header
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, token });

    //     Check if token is valid
    if (!user) return;

    // Check if token has expired
    if (user.expiresIn < Date.now()) {
      await user.removeToken();
      return;
    }
    req.user = user.toJSON();
    res.render('dashboard', { success: true, data: req.user });
  } catch (error) {
    return;
  }
};
