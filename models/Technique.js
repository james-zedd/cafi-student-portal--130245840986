const mongoose = require('mongoose');

const TechniqueSchema = mongoose.Schema({
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
    hasVariants: {
        type: Boolean,
        required: true,
        default: false,
    },
    order: {
        type: Number,
        required: true,
    },
    orderVisible: {
        type: String,
        required: true,
    },
    variants: {
        type: Array,
    },
    oyoWaza: {
        type: Boolean,
        required: true,
        default: false,
    },
    suwariTachiWaza: {
        type: Boolean,
        required: true,
        default: false,
    },
});

module.exports = mongoose.model('technique', TechniqueSchema);
