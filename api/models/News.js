const mongoose = require('mongoose');
const User = require('../models/User');

const NewsSchema = mongoose.Schema({
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    body: {
        type: String,
        required: true,
        maxLength: 5000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('news', NewsSchema);
