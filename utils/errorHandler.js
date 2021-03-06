const errorHandler = (res, error) => {
    console.log(error);
    if (!error.status_code) {
        return res.render('home', {
            message: 'Something went wrong. Please reload or try again later'
        });
    }
    switch (error.code) {
        case 401:
            return res.json({
                error: true,
                message: error.message
            });

        case 400:
            return res.json({
                error: true,
                message: error.message
            });

        default:
            return res.json({
                error: true,
                message: 'Something went wrong'
            });
    }
};

module.exports = errorHandler;
