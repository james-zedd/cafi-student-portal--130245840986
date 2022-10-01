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
        required: true,
        maxLength: 100,
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
