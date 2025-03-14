const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes')
const teacherRoutes = require('./routes/teacherRoutes')

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Add CORS Middleware
app.use(cors());


// Auth Routes
app.use('/api', authRoutes);

//Admin Routes
app.use('/api', adminRoutes);


//teacher Routes
app.use('/api', teacherRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
