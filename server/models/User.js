const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please add a username'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer_not_to_say'],
            default: 'prefer_not_to_say'
        },
        dietaryPreference: {
            type: String,
            enum: ['all', 'veg', 'non-veg'],
            default: 'all'
        },
        avatarUrl: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: '',
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isSuspended: {
            type: Boolean,
            default: false,
        },

        /* ======================
           PASSWORD RESET
        ====================== */
        resetPasswordToken: {
            type: String,
            index: true,
        },
        resetPasswordExpire: {
            type: Date,
            index: true,
        },

        isVerified: {
            type: Boolean,
            default: true,
        },
        otp: String,
        otpExpire: Date,
    },
    {
        timestamps: true,
    }
);

/* ======================
   PASSWORD HASHING HOOK
====================== */
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
