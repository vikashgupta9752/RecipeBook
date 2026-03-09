const mongoose = require('mongoose');

const saveSchema = mongoose.Schema(
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
    },
    {
        timestamps: true,
    }
);

// Ensure a user can only save a recipe once
saveSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model('Save', saveSchema);
