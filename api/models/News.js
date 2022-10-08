const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
    publisher: {
        type: String,
        required: true,
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
