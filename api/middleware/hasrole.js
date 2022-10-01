module.exports = function (requiredRoles) {
    return function (req, res, next) {
        const roles = req.user.roles;

        const hasRole = requiredRoles.every((role) => roles.indexOf(role) > -1);

        if (hasRole) {
            return next();
        }

        return res.status(401).json({
            message: 'You do not have the required role for this.',
        });
    };
};
