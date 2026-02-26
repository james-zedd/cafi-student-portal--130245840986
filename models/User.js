const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 70,
    },
    password: {
        type: String,
        maxLength: 100,
    },
    googleId: {
        type: String,
    },
    appleId: {
        type: String,
    },
    refreshTokens: [
        {
            token: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    roles: {
        type: [String],
        default: 'student',
    },
    registry_date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('user', UserSchema);
