const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');
const Teacher = require('../models/teacherModel');
const Student = require('../models/studentModel');

// Admin Registration
exports.createAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const adminExists = await Admin.findOne({ username });
        if (adminExists) return res.status(400).json({ message: 'Admin already exists.' });

        const newAdmin = await Admin.create({ username, password, role: 'Admin' });
        res.status(201).json({ message: 'Admin created successfully.', newAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin.', error: error.message });
    }
};

//Login Function
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check all user models
        const admin = await Admin.findOne({ username });
        const teacher = await Teacher.findOne({ username });
        const student = await Student.findOne({ username });

        const user = admin || teacher || student;

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        res.status(200).json({
            message: `${user.role} logged in successfully.`,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error during login.', error: error.message });
    }
};

//Logout Function
exports.logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully.' });
};
