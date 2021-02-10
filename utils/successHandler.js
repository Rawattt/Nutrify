const successHandler = (res, status, data) =>
    res.status(status).json({
        user_id: data._id,
        name: data.name,
        email: data.email,
        username: data.username,
        meal: data.meal
    });

module.exports = successHandler;
