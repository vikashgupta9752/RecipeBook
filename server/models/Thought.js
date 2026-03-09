const mongoose = require('mongoose');

const thoughtSchema = mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'Please add thought text'],
        },
        author: {
            type: String,
            default: 'Anonymous',
        },
        date: {
            type: Date,
            default: Date.now,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Thought', thoughtSchema);
