const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['Teacher'], default: 'Teacher' },
    students: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
            addedDate: { type: Date, default: Date.now }
        }
    ],
    quizzes: [  // ✅ Added Quiz Reference
        { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
    ]
}, { timestamps: true });

// Hash password before saving
teacherSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
teacherSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Teacher', teacherSchema);
