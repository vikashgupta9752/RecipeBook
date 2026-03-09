const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
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
        score: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent multiple ratings per user per recipe
ratingSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
