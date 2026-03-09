const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = process.argv[2] || 'admin@cookbook.com';
        const password = process.argv[3] || 'password123';
        const username = process.argv[4] || 'Admin';

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await User.findOne({ email });

        if (user) {
            console.log(`User with email ${email} found. Updating to admin...`);
            user.password = hashedPassword;
            user.isAdmin = true;
            await user.save();
            console.log(`User ${user.username} (${email}) updated. Password set to: ${password}`);
        } else {
            console.log(`Creating new admin user...`);
            user = await User.create({
                username,
                email,
                password: hashedPassword,
                isAdmin: true,
                dietaryPreference: 'all'
            });
            console.log(`User ${user.username} (${email}) created. Password set to: ${password}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
