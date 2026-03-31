const mongoose = require('mongoose');

const DanShiteWazaSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    attack_name: {
        type: Object,
        required: true,
    },
    technique_name: {
        type: Object,
        required: true,
    },
    variants: {
        type: [String],
        required: true,
    },
    dan_levels: {
        type: [Number],
        required: true,
    },
    yondan_suwari_waza: {
        type: Boolean,
        required: true,
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'danshitewazanote',
    }],
});

module.exports = mongoose.model('danshitewaza', DanShiteWazaSchema);
