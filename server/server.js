const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const passport = require("passport");
require("./config/passport"); // 🔥 THIS LINE WAS MISSING OR NOT RUNNING


const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/thoughts', require('./routes/thoughtRoutes'));
app.use('/api/meal-plans', require('./routes/mealPlans'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

    app.get('*', (req, res) =>
        res.sendFile(
            path.resolve(__dirname, '..', 'client', 'dist', 'index.html')
        )
    );
} else {
    app.get('/', (req, res) => res.send('Please set to production'));
}

/* =========================
   GLOBAL ERROR HANDLER (NEW)
========================= */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Server Error',
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log('SERVER RESTARTED FOR DEBUGGING - FORCE RESTART');
});
// Server running
