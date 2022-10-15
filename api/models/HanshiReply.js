const mongoose = require('mongoose');
const User = require('../models/User');

const HanshiReplySchema = mongoose.Schema({
    inquirer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    title: {
        type: String,
        required: true,
        maxLength: 100,
    },
    body: {
        type: String,
        required: true,
        maxLength: 10000000,
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

module.exports = mongoose.model('hanshiReply', HanshiReplySchema);
