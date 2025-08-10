const Student = require('../models/studentModel');


// Get Student Information
exports.getStudentInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ message: 'Student not found.' });

        res.status(200).json({student});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student info.', error: error.message });
    }
};