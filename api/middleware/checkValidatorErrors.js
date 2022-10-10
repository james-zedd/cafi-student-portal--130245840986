const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).validatorErrors = errors.array();
        throw new Error('Express validator errors.');
    }

    next();
};
