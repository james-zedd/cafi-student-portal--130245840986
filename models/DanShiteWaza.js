const mongoose = require('mongoose');

const DanShiteWazaSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    attack_name: {
        type: {
            romanji: { type: String, required: true },
            english: { type: String, required: true },
        },
        required: true,
    },
    technique_name: {
        type: {
            romanji: { type: String, required: true },
            english: { type: String, required: true },
        },
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
    notes: {
        type: [Object],
        required: true,
    },
});

module.exports = mongoose.model('danshitewaza', DanShiteWazaSchema);
