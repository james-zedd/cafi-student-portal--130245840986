const mongoose = require('mongoose');

const DanShiteWazaSchema = mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    dan_shite_waza_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'danshitewaza',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('danshitewazanote', DanShiteWazaSchema);