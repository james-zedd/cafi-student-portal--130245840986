const mongoose = require('mongoose');

const ExamSchema = mongoose.Schema({
    examId: {
        type: String,
        required: true,
    },
    name: {
        rankEng: {
            type: String,
            maxLength: 15,
        },
        rankJpn: {
            type: String,
            maxLength: 25,
        },
        belt: {
            type: String,
            maxLength: 50,
        },
    },
    isAdultExam: {
        type: Boolean,
        required: true,
    },
    techniques: {
        type: Array,
        // need reference to techniques
    },
});

module.exports = mongoose.model('exam', ExamSchema);
