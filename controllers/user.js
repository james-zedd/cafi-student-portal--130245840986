const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const { createAuditLog } = require('./auditLog');

// @route  GET /api/users
// @desc   get all users
// @secure true
// @admin  true
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find().select('name email roles');

        res.status(200).json({
            status: 200,
            message: 'Successfully retrieved users.',
            data: users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles,
            })),
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  POST /api/users
// @desc   Add a user
// @secure true
// @admin  true
const addUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, roles } = req.body;

    try {
        let user = await User.findOne({ email: email });

        if (user) {
            return res.status(400).json({ message: 'user already exists.' });
        }

        user = new User({
            name: name,
            email: email,
            password: password,
            roles: roles || ['student'],
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        await createAuditLog({
            usrId: req.user.id,
            route: req.originalUrl,
            method: req.method,
        });

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
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            roles: user.roles,
                        },
                        token: token,
                    });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
};

// @route  PATCH /api/users/:userId
// @desc   Update a user
// @secure true
// @admin  true
const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { name, email, roles } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found.');
    }

    const changes = [];

    if (email && email !== user.email) {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            res.status(400);
            throw new Error('user already exists.');
        }

        changes.push({ field: 'email', before: user.email, after: email });
        user.email = email;
    }

    if (name && name !== user.name) {
        changes.push({ field: 'name', before: user.name, after: name });
        user.name = name;
    }

    if (
        roles &&
        (roles.length !== user.roles.length ||
            roles.some((role) => !user.roles.includes(role)))
    ) {
        changes.push({ field: 'roles', before: user.roles, after: roles });
        user.roles = roles;
    }

    await user.save();

    await createAuditLog({
        usrId: req.user.id,
        route: req.originalUrl,
        method: req.method,
        changes: changes,
    });

    res.status(200).json({
        status: 200,
        message: 'User has been updated.',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
        },
    });
});

module.exports = {
    getAllUsers,
    addUser,
    updateUser,
};
