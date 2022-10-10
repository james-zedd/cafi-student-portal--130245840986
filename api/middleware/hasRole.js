const asyncHandler = require('express-async-handler');

module.exports = (requiredRoles) => {
    return asyncHandler((req, res, next) => {
        const roles = req.user.roles;

        const hasRole = requiredRoles.every((role) => roles.indexOf(role) > -1);

        if (hasRole) {
            return next();
        } else {
            res.status(401);
            throw new Error('You do not have the required role(s).');
        }
    });
};
