const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Recipe',
        },
        text: {
            type: String,
            required: [true, 'Please add a comment'],
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Comment', commentSchema);
