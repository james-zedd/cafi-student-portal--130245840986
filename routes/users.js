const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwtAuth = require('../middleware/jwtAuth');
const postBlock = require('../middleware/postBlock');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// @route  POST /api/users
// @desc   Add a user
// @secure false
router.post(
    '/',
    jwtAuth,
    postBlock,
    [
        check('name', 'Please add a name').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a password - 6 char min').isLength({
            min: 6,
            max: 50,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email: email });

            if (user) {
                return res
                    .status(400)
                    .json({ message: 'user already exists.' });
            }

            user = new User({
                name: name,
                email: email,
                password: password,
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                    roles: user.roles,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 1800 },
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    res.status(201)
                        .cookie('cafiStudent', token, {
                            secure: process.env.NODE_ENV === 'production',
                            httpOnly: true,
                        })
                        .json({
                            status: 200,
                            user: user,
                            token: token,
                        });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error');
        }
    }
);

module.exports = router;
