const asyncHandler = require('express-async-handler');

module.exports = asyncHandler((req, res, next) => {
    if (process.env.POST_BLOCK == 'false') {
        return next();
    } else {
        res.status(401);
        throw new Error(
            'POST requests are not currently allowed on this route.'
        );
    }
});
