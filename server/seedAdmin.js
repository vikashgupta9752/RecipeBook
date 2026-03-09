const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = process.argv[2] || 'admin@cookbook.com';
        
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.isAdmin = true;
        await user.save();
        
        console.log(`User ${user.username} (${email}) is now an admin.`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
