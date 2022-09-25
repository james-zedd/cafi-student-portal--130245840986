const mongoose = require('mongoose');

const TechniqueSchema = mongoose.Schema({
    techId: {
        type: String,
        required: true,
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
    variants: {
        type: Array,
        // need reference to techniques
    },
    irimiTenkan: {
        type: String,
        enum: ['irimi', 'tenkan'],
    },
    stance: {
        type: String,
        enum: ['aihanmi', 'gyakuhanmi'],
    },
});

module.exports = mongoose.model('technique', TechniqueSchema);
