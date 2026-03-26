const mongoose = require('mongoose');

const KotoShitsumonSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    question: {
        type: String,
        required: true,
    },
    categories: {
        type: [String],
        required: true,
    },
    correct_answer: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        required: true,
    },
    answers: {
        type: [String],
        required: true,
    }
});

module.exports = mongoose.model('kotoshitsumon', KotoShitsumonSchema);