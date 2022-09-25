const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
    publisher: {
        type: String,
        required: true,
        // needs user reference based on logged in user
    },
    title: {
        type: String,
        required: true,
        maxLength: 100,
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
});

module.exports = mongoose.model('news', NewsSchema);
