const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    introduction: { type: String },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    questions: [
        {
            text: { type: String, required: true },
            choices: [{ type: String, required: true }],
            correctAnswer: { type: String, required: true },
            monster: { type: String, default: "snake" }, 
            points: { type: Number, required: true }
        }
    ],
    totalPoints: { type: Number, default: 0 }, 
    status: { type: String, enum: ['Current', 'Completed'], default: 'Current' }, 
    studentAnswers: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
            answers: [
                {
                    questionIndex: { type: Number, required: true },
                    selectedAnswer: { type: String, required: true },
                    isCorrect: { type: Boolean, required: true }
                }
            ],
            totalScore: { type: Number, default: 0 },
            status: { type: String, enum: ['Not Completed', 'Completed'], default: 'Not Completed' },
            answeredAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
