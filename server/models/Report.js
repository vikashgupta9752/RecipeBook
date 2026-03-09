const mongoose = require('mongoose');

const reportSchema = mongoose.Schema(
    {
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        targetType: {
            type: String,
            enum: ['Recipe', 'Comment', 'User', 'Group'],
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'targetType',
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'resolved', 'dismissed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Report', reportSchema);
