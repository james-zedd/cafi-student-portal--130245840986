const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const jwtAuth = require('../middleware/jwtAuth');
const postBlock = require('../middleware/postBlock');
const hasRole = require('../middleware/hasRole');
const isValidObjectId = require('../middleware/isValidObjectId');
const checkValidatorErrors = require('../middleware/checkValidatorErrors');

const { addUser, updateUser } = require('../controllers/user');

// @route  POST /api/users
// @desc   Add a user
// @secure true
// @admin  true
router.post(
    '/',
    jwtAuth,
    postBlock,
    hasRole(['admin']),
    [
        check('name', 'Please add a name').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a password - 6 char min').isLength({
            min: 6,
            max: 50,
        }),
    ],
    addUser
);

// @route  PATCH /api/users/:userId
// @desc   Update a user
// @secure true
// @admin  true
router.patch(
    '/:userId',
    jwtAuth,
    postBlock,
    hasRole(['admin']),
    isValidObjectId('paramsUser'),
    [
        check('name', 'Please add a name').optional().not().isEmpty(),
        check('email', 'Please enter a valid email').optional().isEmail(),
        check('roles', 'Roles must be an array').optional().isArray(),
    ],
    checkValidatorErrors,
    updateUser
);

module.exports = router;
