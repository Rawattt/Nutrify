const mongoose = require('mongoose');
const User = require('../models/user');
const HttpError = require('../utils/error');
const errorHandler = require('../utils/errorHandler');
const successHandler = require('../utils/successHandler');

// @desc      Get today's dashboard
// @route     GET /user/dashboard
// @access    Private
exports.dashboard = async (req, res) => {
    try {
        // Get current user data from the database
        const user = await User.findById(req.session.user_id);

        // Remove unnecessary information
        const user_data = user.toJSON();

        let today = new Date().setHours(0, 0, 0, 0);

        // FILTER meals
        user_data.meal = user_data.meal.filter(
            (food) => food.datetime >= today
        );

        // Set for todays dashboard
        user_data.today = true;

        // Set total calories consumed
        let consumed = 0;
        for (let i of user_data.meal) consumed += parseInt(i.calories);

        user_data.consumed = consumed;
        console.log(user_data);

        res.render('dashboard', { user_data });
    } catch (error) {
        errorHandler(res, error);
    }
};
// @desc      Get today's dashboard
// @route     GET /user/dashboard/search?start_date&end_date&sortBy&order
// @access    Private
exports.dashboardSearch = async (req, res) => {
    try {
        // Get current user data from the database
        const user = await User.findById(req.session.user_id);
        console.log(user);

        // Remove unnecessary information
        const user_data = user.toJSON();

        // Extract query data
        let { start_date, end_date, sortBy, order } = req.query;

        let start_date_time, end_date_time;

        // Set start date for query
        if (start_date) {
            start_date_time = new Date(start_date).setHours(0, 0, 0, 0);
        } else {
            start_date_time = new Date().setHours(0, 0, 0, 0);
        }

        // Set end date for query
        if (end_date) {
            end_date_time = new Date(end_date).setHours(0, 0, 0, 0) + 86400000;
        }
        if (!end_date || end_date_time < start_date_time)
            end_date_time = start_date_time + 86400000;

        // FILTER meals
        user_data.meal = user_data.meal.filter(
            (food) =>
                food.datetime >= start_date_time &&
                food.datetime < end_date_time
        );

        // Check if only one day meals
        if (end_date_time - start_date_time === 86400000)
            user_data.showBar = true;

        // Only sort if req.usery has any value
        if (req.query && Object.keys(req.query).length > 0) {
            // Set the sorting order
            if (!order) order = 1;
            else order = parseInt(order);

            // SORT meals
            user_data.meal.sort(
                (a, b) => order * a[sortBy] - order * b[sortBy]
            );
        }

        res.render('dashboard', { user_data });
    } catch (error) {
        errorHandler(res, error);
    }
};

// @desc      Get current logged in user's profile
// @route     GET /user/profile
// @access    Private
exports.getMyProfile = async (req, res) => {
    try {
        successHandler(res, 'profile', req.user);
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        errorHandler(
            new HttpError(
                'Something went wrong. Please refresh or try again later',
                500
            )
        );
    }
};

// Add all meals
const addMeals = (meal1, meal2) => meal1.calories + meal2.calories;
