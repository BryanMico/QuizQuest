const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    studentID: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    points: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 }, 
    pointsSpent: { type: Number, default: 0 }, 
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true } 
}, { timestamps: true });

// Hash password before saving
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password isn't modified

    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (error) {
        next(error); // Pass error to the next middleware
    }
});

// Method to compare passwords
studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
