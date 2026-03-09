const mongoose = require('mongoose');

const activitySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['friend_request', 'friend_accepted', 'group_invite', 'group_joined', 'recipe_forked', 'recipe_shared', 'comment_added'],
            required: true,
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            // Can reference different models depending on type
        },
        targetModel: {
            type: String,
            enum: ['Recipe', 'Group', 'Friendship'],
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Activity', activitySchema);
