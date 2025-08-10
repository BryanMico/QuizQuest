const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    questType: { 
        type: String, 
        required: true, 
        enum: ['complete_quizzes', 'score_percentage', 'earn_points'] 
    },
    targetValue: { type: Number, required: true }, // Number of quizzes, percentage, or points
    points: { type: Number, required: true }, // Reward points
    status: { type: String, enum: ['Active', 'Archived'], default: 'Active' },
    completions: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
            completedAt: { type: Date, default: Date.now },
            pointsAwarded: { type: Number, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date } // Optional expiration date
}, { timestamps: true });

module.exports = mongoose.model('Quest', questSchema);
