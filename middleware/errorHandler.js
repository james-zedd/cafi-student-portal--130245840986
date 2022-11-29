const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    const validatorErrors = res.validatorErrors ? res.validatorErrors : [];

    res.status(statusCode).json({
        status: statusCode,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        expressValidatorErrors: validatorErrors,
    });
};

module.exports = { errorHandler };
