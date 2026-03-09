const mongoose = require('mongoose');

const viewSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Recipe',
        },
        ip: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index to efficiently query views for a specific recipe by user or IP
viewSchema.index({ recipe: 1, user: 1, ip: 1 });

module.exports = mongoose.model('View', viewSchema);
