const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');


// Get Teacher Information
exports.getTeacherInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const teacher = await Teacher.findById(id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found.' });

        res.status(200).json({ teacher });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teacher info.', error: error.message });
    }
};

// Create Student Function
exports.createStudent = async (req, res) => {
    const { teacherId, name, studentID, username, password } = req.body;

    try {
        const teacherExists = await Teacher.findById(teacherId);
        if (!teacherExists) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        const studentExists = await Student.findOne({ username });
        if (studentExists) {
            return res.status(400).json({ message: 'Student username already exists.' });
        }

        const newStudent = await Student.create({
            name,
            studentID,
            username,
            password,
            teacherId
        });

        // Add student reference to Teacher's students array
        teacherExists.students.push({
            studentId: newStudent._id,
            addedDate: new Date() // ✅ Records the exact date
        });

        await teacherExists.save(); // Save the updated teacher document

        res.status(201).json({ message: 'Student created successfully.', newStudent });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Error creating student.', error: error.message });
    }
};

// Update Student
exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, studentID, username, password } = req.body;

    try {
        const student = await Student.findById(id);

        if (!student) return res.status(404).json({ message: 'Student not found.' });

        student.name = name || student.name;
        student.studentID = studentID || student.studentID;
        student.username = username || student.username;
        student.password = password || student.password; // Consider hashing the password if applicable

        await student.save();
        res.status(200).json({ message: 'Student updated successfully.', student});
    } catch (error) {
        res.status(500).json({ message: 'Error updating student.', error: error.message });
    }
};

// Remove Student
exports.removeStudent = async (req, res) => {
    const { id } = req.params;

    try {

        // Attempt to find and delete the student
        const student = await Student.findByIdAndDelete(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Update Teacher's student list to remove the student
        const teacherUpdateResult = await Teacher.updateOne(
            { _id: student.teacherId },
            { $pull: { students: { studentId: student._id } } }
        );

        if (teacherUpdateResult.modifiedCount === 0) {
            console.log('No teacher record updated');
            return res.status(500).json({ message: 'Failed to remove student from teacher’s list.' });
        }
        res.status(200).json({ message: 'Student removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing student.', error: error.message });
    }
};



// Get All Students for a Specific Teacher
exports.getAllStudents = async (req, res) => {
    const { teacherId } = req.params; // Assuming you're passing teacherId in the URL

    try {
        const students = await Student.find({ teacherId }); // Filter by teacherId
        if (!students.length) {
            return res.status(404).json({ message: 'No students found for this teacher.' });
        }

        res.status(200).json({ students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students.', error: error.message });
    }
};

