const mongoose = require('mongoose');
const User = require('./User');
const HanshiReply = require('./HanshiReply');

const HanshiAskSchema = mongoose.Schema({
    inquirer: {
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
    status: {
        type: String,
        enum: [
            'new',
            'inReview',
            'isAnswered',
            'cannotBeAnswered',
            'duplicate',
        ],
        default: 'new',
    },
    isAnswered: {
        type: Boolean,
        default: false,
    },
    cannotBeAnswered: {
        type: Boolean,
        default: false,
    },
    replyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: HanshiReply,
    },
});

module.exports = mongoose.model('hanshiAsk', HanshiAskSchema);
