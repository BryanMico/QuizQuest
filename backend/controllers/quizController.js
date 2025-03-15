const Quiz = require('../models/quizModel');
const Teacher = require('../models/teacherModel');

// Create a new quiz
exports.createQuiz = async (req, res) => {
    const { title, introduction, teacherId, questions } = req.body;

    try {

        if (!teacherId) {
            return res.status(400).json({ message: 'Teacher ID is required.' });
        }

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        const sanitizedQuestions = questions.map(q => ({
            ...q,
            points: parseInt(q.points) || 0
        }));

        const totalPoints = sanitizedQuestions.reduce((total, question) => total + question.points, 0);

        const newQuiz = await Quiz.create({
            title,
            introduction,
            teacherId,
            questions: sanitizedQuestions,
            totalPoints
        });

        teacher.quizzes.push(newQuiz._id);
        await teacher.save();

        res.status(201).json({ message: 'Quiz created successfully.', newQuiz });
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz.', error: error.message });
    }
};



//  Get all quizzes for a teacher
exports.getQuizzesByTeacher = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ teacherId: req.params.teacherId });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes.', error: error.message });
    }
};

//  Get a single quiz by ID
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz.', error: error.message });
    }
};

//  Update a quiz
exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }
        res.json({ message: 'Quiz updated successfully.', quiz });
    } catch (error) {
        res.status(500).json({ message: 'Error updating quiz.', error: error.message });
    }
};

//  Delete a quiz
exports.deleteQuiz = async (req, res) => {
    const { id } = req.params; // Quiz ID

    try {
        // Find and delete the quiz
        const quiz = await Quiz.findByIdAndDelete(id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }

        // Use the teacherId directly from the quiz data
        const teacherUpdateResult = await Teacher.updateOne(
            { _id: quiz.teacherId },
            { $pull: { quizzes: { quizId: quiz._id } } }
        );

        if (teacherUpdateResult.modifiedCount === 0) {
            console.log('No teacher record updated');
            return res.status(500).json({ message: 'Failed to remove quiz from teacher’s list.' });
        }

        res.status(200).json({ message: 'Quiz removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing quiz.', error: error.message });
    }
};

//  Answer a quiz (Student Submission)
exports.answerQuiz = async (req, res) => {
    try {
        const { studentId, answers } = req.body;
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        let totalScore = 0;
        const processedAnswers = answers.map((answer, index) => {
            const question = quiz.questions[index];
            const isCorrect = question.correctAnswer === answer.selectedAnswer;
            if (isCorrect) totalScore += question.points;

            return {
                questionIndex: index,
                selectedAnswer: answer.selectedAnswer,
                isCorrect
            };
        });

        // Check if student already answered
        const existingAttempt = quiz.studentAnswers.find(attempt => attempt.studentId.toString() === studentId);
        if (existingAttempt) {
            return res.status(400).json({ message: "You have already completed this quiz." });
        }

        // Push new attempt and mark as completed
        quiz.studentAnswers.push({
            studentId,
            answers: processedAnswers,
            totalScore,
            status: "Completed",
            answeredAt: new Date()
        });

        await quiz.save();

        res.json({ message: "Quiz answered successfully!", score: totalScore });
    } catch (error) {
        res.status(500).json({ message: 'Error answering quiz.', error: error.message });
    }
};
