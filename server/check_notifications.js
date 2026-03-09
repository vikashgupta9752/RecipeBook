const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const Notification = require('./models/Notification');
const User = require('./models/User');

const checkNotifications = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const users = await User.find({}).limit(2);
        if (users.length >= 2) {
            console.log('Creating test notification...');
            try {
                const n = await Notification.create({
                    recipient: users[0]._id,
                    sender: users[1]._id,
                    type: 'like',
                    recipe: null
                });
                console.log('Test notification created:', n._id);
            } catch (e) {
                console.error('Creation failed:', e);
            }
        }

        const notifications = await Notification.find({}).sort({ createdAt: -1 });
        console.log(`\n\n=== NOTIFICATION COUNT: ${notifications.length} ===\n\n`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkNotifications();
