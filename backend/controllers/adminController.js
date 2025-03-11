const Teacher = require('../models/teacherModel');

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

// Remove Teacher
exports.removeTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const teacher = await Teacher.findByIdAndDelete(id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found.' });

        res.status(200).json({ message: 'Teacher removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing teacher.', error: error.message });
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

