const mongoose = require('mongoose');

const AuditLogSchema = mongoose.Schema({
    timestamp: {
        type: Number,
        default: Date.now,
        required: true,
    },
    user: {
        name: {
            type: String,
            required: true,
        },
        roles: {
            type: [String],
            required: true,
        },
    },
    route: {
        type: String,
        maxLength: 200,
    },
    method: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
    changes: [
        {
            field: {
                type: String,
                required: true,
            },
            before: mongoose.Schema.Types.Mixed,
            after: mongoose.Schema.Types.Mixed,
        },
    ],
});

module.exports = mongoose.model('auditLog', AuditLogSchema);
