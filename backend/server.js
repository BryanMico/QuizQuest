const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const quizRoutes = require('./routes/quizRoutes')
const studentRoutes = require('./routes/studentRoutes')
const rewardRoutes = require('./routes/rewardRoutes');
const questRoutes = require('./routes/questRoutes')

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Add CORS Middleware
app.use(cors());

// Auth Routes
app.use('/api', authRoutes);

// Admin Routes
app.use('/api', adminRoutes);

// Teacher Routes
app.use('/api', teacherRoutes);

// Quiz Routes 
app.use('/api', quizRoutes);

// Student Routes 
app.use('/api', studentRoutes);

// Reward Routes 
app.use('/api', rewardRoutes);

// Quest Routes 
app.use('/api', questRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
