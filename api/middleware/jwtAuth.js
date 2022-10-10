const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

module.exports = asyncHandler((req, res, next) => {
    let token = req.cookies.cafiStudent || req.header('Authorization');

    if (!token) {
        res.status(401);
        throw new Error('No token. Authorization denied.');
    }

    const jwtToken = token.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Token is not valid.');
    }
});
