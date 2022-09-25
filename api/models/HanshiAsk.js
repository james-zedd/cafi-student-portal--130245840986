const mongoose = require('mongoose');

const HanshiAskSchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
        // needs user reference based on logged in user
    },
    body: {
        type: String,
        required: true,
        maxLength: 1000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isAnswered: {
        type: Boolean,
        default: false,
    },
    cannotBeAnswered: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('hanshiAsk', HanshiAskSchema);
