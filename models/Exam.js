const mongoose = require('mongoose');
const Technique = require('./Technique');

const ExamSchema = mongoose.Schema({
    examId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        rankEng: {
            type: String,
            maxLength: 15,
        },
        belt: {
            type: String,
            maxLength: 50,
        },
    },
    isAdultExam: {
        type: Boolean,
        required: true,
        default: true,
    },
    isDanExam: {
        type: Boolean,
        required: true,
        default: false,
    },
    techniques: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Technique,
        },
    ],
});

module.exports = mongoose.model('exam', ExamSchema);
