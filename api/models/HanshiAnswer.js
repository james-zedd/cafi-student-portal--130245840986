const mongoose = require('mongoose');

const HanshiAnswerSchema = mongoose.Schema({
    answerId: {
        type: Number,
        default: 10000,
        // need system for incrementing
    },
    publisher: {
        type: String,
        required: true,
        // insert into POST/PUT via JWT
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
    },
});

module.exports = mongoose.model('hanshiAnswer', HanshiAnswerSchema);
