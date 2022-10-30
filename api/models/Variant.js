const mongoose = require('mongoose');

const VariantSchema = mongoose.Schema({
    techId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        english: {
            type: String,
            maxLength: 250,
        },
        romanji: {
            type: String,
            maxLength: 250,
        },
    },
    category: {
        type: String,
    },
    heading: {
        type: String,
    },
    order: {
        type: Number,
        required: true,
    },
    orderVisible: {
        type: String,
    },
    oyoWaza: {
        type: Boolean,
        default: false,
    },
    suwariTachiWaza: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('variant', VariantSchema);
