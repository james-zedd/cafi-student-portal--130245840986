const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middleware/jwtAuth');

const User = require('../models/User');

// @route  GET /api/auth
// @desc   get logged in user
// @secure true
router.get('/', jwtAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            res.status(400).json({
                status: 400,
                data: 'user not found',
            });
        }

        res.status(200).json({
            status: 200,
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: 'server error',
            error: error,
        });
    }
});

// @route  POST /api/auth
// @desc   log in user
// @secure false
router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        const { email, password } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Validation errors',
            });
        }

        try {
            const user = await User.findOne({ email: email });

            if (user == null) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid credentials',
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid credentials',
                });
            }

            const payload = {
                user: {
                    id: user.id,
                    roles: user.roles,
                },
            };

            const currentDate = new Date();
            const expiryTime = 1800;
            const expiryTimeUnix = currentDate.getTime() + expiryTime * 1000;

            console.log(
                'current date',
                currentDate,
                'expiry time unix',
                expiryTimeUnix
            );

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: expiryTime },
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200)
                        .cookie('cafiStudent', token, {
                            secure: process.env.NODE_ENV === 'production',
                            httpOnly: true,
                        })
                        .cookie('cafiStudentSessionExp', expiryTimeUnix)
                        .json({
                            status: 200,
                            message: 'Successfully logged in',
                            token: token,
                        });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                status: 500,
                message: 'Server error',
                error: error,
            });
        }
    }
);

// @route  GET /api/auth/logout
// @desc   log out current user
// @secure true
router.get('/logout', jwtAuth, (req, res) => {
    res.clearCookie('cafiStudent')
        .clearCookie('cafiStudentSessionExp')
        .status(200)
        .json({
            status: 200,
            message: 'Successfully logged user out',
        });
});

// @route  GET /api/auth/header
// @desc   get header for user
// @secure true
router.get('/header', jwtAuth, (req, res) => {
    let menuItems = [];

    menuItems.push(
        { name: 'Dashboard', path: 'dashboard' },
        { name: 'Exams', path: 'exams' },
        { name: 'Student Inquiries', path: 'studentInquiries' },
        { name: 'Hanshi Articles', path: 'articlesHanshi' }
    );

    if (req.user.roles.includes('hanshi')) {
        menuItems.push({ name: 'Create Article', path: 'article/create' });
    }

    if (!req.user.roles.includes('hanshi')) {
        menuItems.push({ name: 'Ask Question', path: 'askQuestion' });
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully fetched header',
        data: {
            menuItems: menuItems,
            roles: req.user.roles,
        },
    });
});

module.exports = router;
