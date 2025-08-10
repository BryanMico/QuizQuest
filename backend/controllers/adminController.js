const Teacher = require('../models/teacherModel');
const Student = require('../models/studentModel');
const Quiz = require('../models/quizModel');
const Reward = require('../models/rewardModel');
const Quest = require('../models/questModel');
const PurchasedReward = require('../models/purchaseModel');
const mongoose = require('mongoose');

// Create Teachers
exports.createTeacher = async (req, res) => {
    const { name, subject, username, password } = req.body;
    try {
        const teacherExists = await Teacher.findOne({ username });
        if (teacherExists) return res.status(400).json({ message: 'Teacher already exists.' });

        const newTeacher = await Teacher.create({ name, subject, username, password });
        res.status(201).json({ message: 'Teacher created successfully.', newTeacher });
    } catch (error) {
        res.status(500).json({ message: 'Error creating teacher.', error: error.message });
    }
};

// Edit/Update Teacher
exports.updateTeacher = async (req, res) => {
    const { id } = req.params;
    const { name, subject, username, password } = req.body;

    try {
        const teacher = await Teacher.findById(id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found.' });

        teacher.name = name || teacher.name;
        teacher.subject = subject || teacher.subject;
        teacher.username = username || teacher.username;
        teacher.password = password || teacher.password; // Consider hashing the password if applicable

        await teacher.save();
        res.status(200).json({ message: 'Teacher updated successfully.', teacher });
    } catch (error) {
        res.status(500).json({ message: 'Error updating teacher.', error: error.message });
    }
};



exports.removeTeacher = async (req, res) => {
    const { id } = req.params;
    
    try {
        // First check if teacher exists
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json({ 
                success: false,
                message: 'Teacher not found.' 
            });
        }

        // Delete related data one by one
        try {
            await Student.deleteMany({ teacherId: id });
            await Quiz.deleteMany({ teacherId: id });
            await Reward.deleteMany({ teacherId: id });
            await Quest.deleteMany({ teacherId: id });
            await PurchasedReward.deleteMany({ teacherId: id });
            await Teacher.findByIdAndDelete(id);
            
            return res.status(200).json({ 
                success: true,
                message: 'Teacher and all associated data removed successfully.' 
            });
        } catch (deleteError) {
            throw deleteError; // Re-throw to be caught by outer catch
        }
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error removing teacher and associated data.', 
            error: error.message 
        });
    }
};
// Get All teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json({ teachers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teachers.', error: error.message });
    }
};



