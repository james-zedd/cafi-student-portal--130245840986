const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');
const { OAuth2Client } = require('google-auth-library');
const appleSignin = require('apple-signin-auth');
const jwtAuth = require('../middleware/jwtAuth');

const User = require('../models/User');

const resend = new Resend(process.env.RESEND_API_KEY);
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const ACCESS_TOKEN_EXPIRY = 3600;        // 1 hour in seconds
const REFRESH_TOKEN_EXPIRY = 60 * 24 * 60 * 60; // 60 days in seconds

const signToken = (payload, secret, options) =>
    new Promise((resolve, reject) =>
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err);
            else resolve(token);
        })
    );

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

            if (!user.password) {
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

            const accessToken = await signToken(payload, process.env.JWT_SECRET, {
                expiresIn: ACCESS_TOKEN_EXPIRY,
            });

            const refreshToken = await signToken(
                { user: { id: user.id } },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRY }
            );

            user.refreshTokens.push({ token: refreshToken });
            await user.save();

            res.status(200).json({
                status: 200,
                message: 'Successfully logged in',
                token: accessToken,
                refreshToken,
            });
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

// @route  POST /api/auth/logout
// @desc   log out current user and revoke refresh token
// @secure true
router.post('/logout', jwtAuth, async (req, res) => {
    const { refreshToken } = req.body;

    try {
        if (refreshToken) {
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { refreshTokens: { token: refreshToken } },
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully logged user out',
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: 500,
            message: 'Server error',
            error: error,
        });
    }
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

// @route  POST /api/auth/forgot-password
// @desc   send password reset email
// @secure false
router.post(
    '/forgot-password',
    [check('email', 'Please include a valid email').isEmail()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, message: 'Validation errors', errors: errors.array() });
        }

        try {
            const user = await User.findOne({ email: req.body.email });

            // Always return 200 to avoid revealing whether an email is registered
            if (!user) {
                return res.status(200).json({ status: 200, message: 'If that email is registered, a reset link has been sent' });
            }

            if (!user.password) {
                // Social-only account — no password to reset
                return res.status(200).json({ status: 200, message: 'If that email is registered, a reset link has been sent' });
            }

            const rawToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

            user.resetPasswordToken = hashedToken;
            user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
            await user.save();

            const resetUrl = `${process.env.RESET_PASSWORD_URL}?token=${rawToken}`;

            await resend.emails.send({
                from: `CAFI Student Portal <noreply@mail.chudokaiaikidofederationinternational.org>`,
                to: user.email,
                subject: 'Password Reset Request',
                html: `
                    <p>You requested a password reset for your CAFI Student Portal account.</p>
                    <p>Click the link below to reset your password. This link expires in 1 hour.</p>
                    <p><a href="${resetUrl}">Click here to reset your password</a></p>
                    <p>If you did not request this, you can safely ignore this email.</p>
                `,
            });

            res.status(200).json({ status: 200, message: 'If that email is registered, a reset link has been sent' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ status: 500, message: 'Server error', error: error });
        }
    }
);

// @route  POST /api/auth/reset-password
// @desc   reset password using token from email
// @secure false
router.post(
    '/reset-password',
    [
        check('token', 'Token is required').notEmpty(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, message: 'Validation errors', errors: errors.array() });
        }

        try {
            const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');

            const user = await User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: Date.now() },
            });

            if (!user) {
                return res.status(400).json({ status: 400, message: 'Invalid or expired reset token' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            // Revoke all refresh tokens on password reset
            user.refreshTokens = [];

            await user.save();

            res.status(200).json({ status: 200, message: 'Password reset successful' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ status: 500, message: 'Server error', error: error });
        }
    }
);

// @route  POST /api/auth/refresh
// @desc   rotate refresh token and issue new access + refresh tokens
// @secure false
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ status: 401, message: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findOne({
            _id: decoded.user.id,
            'refreshTokens.token': refreshToken,
        });

        if (!user) {
            return res.status(401).json({ status: 401, message: 'Invalid refresh token' });
        }

        // Rotate: remove old token, issue new pair
        user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);

        const payload = { user: { id: user.id, roles: user.roles } };

        const newAccessToken = await signToken(payload, process.env.JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });

        const newRefreshToken = await signToken(
            { user: { id: user.id } },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        user.refreshTokens.push({ token: newRefreshToken });
        await user.save();

        res.status(200).json({
            status: 200,
            message: 'Token refreshed',
            token: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        // jwt.verify throws if expired or invalid
        return res.status(401).json({ status: 401, message: 'Invalid or expired refresh token' });
    }
});

// @route  POST /api/auth/google
// @desc   sign in or register with Google
// @secure false
router.post('/google', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ status: 400, message: 'idToken is required' });
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: [process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_ID_ANDROID],
        });

        const { sub: googleId, email, name } = ticket.getPayload();

        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.findOne({ email });

            if (user) {
                // Existing email/password account — link Google to it
                user.googleId = googleId;
                await user.save();
            } else {
                return res.status(403).json({ status: 403, message: 'No account found. Please contact your administrator.' });
            }
        }

        const payload = { user: { id: user.id, roles: user.roles } };

        const accessToken = await signToken(payload, process.env.JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });

        const refreshToken = await signToken(
            { user: { id: user.id } },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        user.refreshTokens.push({ token: refreshToken });
        await user.save();

        res.status(200).json({
            status: 200,
            message: 'Successfully signed in with Google',
            token: accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ status: 401, message: 'Invalid Google token' });
    }
});

// @route  POST /api/auth/apple
// @desc   sign in with Apple
// @secure false
router.post('/apple', async (req, res) => {
    const { identityToken, fullName } = req.body;

    if (!identityToken) {
        return res.status(400).json({ status: 400, message: 'identityToken is required' });
    }

    try {
        const payload = await appleSignin.verifyIdToken(identityToken, {
            audience: process.env.APPLE_CLIENT_ID,
            ignoreExpiration: false,
        });

        const { sub: appleId, email } = payload;

        let user = await User.findOne({ appleId });

        if (!user) {
            // email is only present on the first sign-in from Apple
            if (email) {
                user = await User.findOne({ email });

                if (user) {
                    // Existing account — link Apple to it
                    user.appleId = appleId;
                    await user.save();
                }
            }

            if (!user) {
                return res.status(403).json({ status: 403, message: 'No account found. Please contact your administrator.' });
            }
        }

        const accessTokenPayload = { user: { id: user.id, roles: user.roles } };

        const accessToken = await signToken(accessTokenPayload, process.env.JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });

        const refreshToken = await signToken(
            { user: { id: user.id } },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        user.refreshTokens.push({ token: refreshToken });
        await user.save();

        res.status(200).json({
            status: 200,
            message: 'Successfully signed in with Apple',
            token: accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ status: 401, message: 'Invalid Apple token' });
    }
});

module.exports = router;
