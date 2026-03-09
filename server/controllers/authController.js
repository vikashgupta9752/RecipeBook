const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

/* ======================
   REGISTER USER
====================== */
const registerUser = async (req, res) => {
    try {
        const { username, email, password, gender } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Password validation
        const passwordRegex =
            /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long and contain at least one number and one special character.',
            });
        }

        // Check email
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check username
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username is not available' });
        }

        // ✅ DO NOT hash manually (model will hash)
        const user = await User.create({
            username,
            email,
            password,
            gender: gender || 'prefer_not_to_say',
        });

        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            dietaryPreference: user.dietaryPreference,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('REGISTER ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/* ======================
   LOGIN USER
====================== */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            dietaryPreference: user.dietaryPreference,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/* ======================
   VERIFY EMAIL (OTP)
====================== */
const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({
            email,
            otp,
            otpExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            dietaryPreference: user.dietaryPreference,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('VERIFY EMAIL ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/* ======================
   GET ME
====================== */
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

/* ======================
   UPDATE PROFILE
====================== */
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.dietaryPreference =
            req.body.dietaryPreference || user.dietaryPreference;

        const updatedUser = await user.save({ validateBeforeSave: false });

        res.json({
            _id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            dietaryPreference: updatedUser.dietaryPreference,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        console.error('UPDATE PROFILE ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/* ======================
   CHANGE PASSWORD
====================== */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const passwordRegex =
            /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long and contain at least one number and one special character.',
            });
        }

        // ✅ Plain password (model hashes it)
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('CHANGE PASSWORD ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/* ======================
   JWT
====================== */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    verifyEmail,
    changePassword,
};
