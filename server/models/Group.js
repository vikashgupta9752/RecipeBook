const mongoose = require('mongoose');

const groupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        invitations: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            status: {
                type: String,
                enum: ['pending', 'accepted', 'declined'],
                default: 'pending',
            },
            invitedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        coverImage: {
            type: String,
            default: '',
        },
        isPrivate: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Group', groupSchema);
