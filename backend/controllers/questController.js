const Quest = require('../models/questModel');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const Quiz = require('../models/quizModel');

exports.createQuest = async (req, res) => {
    try {
        const { title, description, questType, targetValue, teacherId, points, expiresAt } = req.body;

        // Validate input
        if (!title || !questType || !targetValue || !points) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields' 
            });
        }

        // Create new quest
        const newQuest = new Quest({
            title,
            description,
            teacherId,
            questType,
            targetValue: Number(targetValue),
            points: Number(points),
            expiresAt: expiresAt ? new Date(expiresAt) : null
        });

        await newQuest.save();

        res.status(201).json({
            success: true,
            message: 'Quest created successfully',
            data: newQuest
        });
    } catch (error) {
        console.error('Error creating quest:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create quest',
            error: error.message
        });
    }
};

// Get all quests for a teacher
exports.getTeacherQuests = async (req, res) => {
    try {
        const { teacherId } = req.params; // Assuming you're passing teacherId in the URL
        const quests = await Quest.find({ teacherId });
        
        res.status(200).json({
            success: true,
            count: quests.length,
            data: quests
        });
    } catch (error) {
        console.error('Error fetching quests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve quests',
            error: error.message
        });
    }
};

// Get active quests for a student
exports.getActiveQuestsForStudent = async (req, res) => {
    try {
        const { studentId, teacherId } = req.params;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Ensure student has the correct teacher
        if (student.teacherId.toString() !== teacherId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access to this student’s quests'
            });
        }

        // Find active quests from the student's teacher
        const quests = await Quest.find({
            teacherId: student.teacherId,
            status: 'Active',
            expiresAt: { $gt: new Date() } // Only include non-expired quests
        });

        // Filter out quests already completed by the student
        const availableQuests = quests.filter(quest =>
            !quest.completions.some(completion =>
                completion.studentId.toString() === studentId.toString()
            )
        );

        res.status(200).json({
            success: true,
            count: availableQuests.length,
            data: availableQuests
        });
    } catch (error) {
        console.error('Error fetching student quests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve quests',
            error: error.message
        });
    }
};


// Update a quest
exports.updateQuest = async (req, res) => {
    try {
        const questId = req.params.questId;
        const { title, description, questType, targetValue, points, status, expiresAt } = req.body;
        const teacherId = req.user._id;
        
        // Find the quest and ensure it belongs to this teacher
        const quest = await Quest.findOne({ _id: questId, teacherId });
        if (!quest) {
            return res.status(404).json({
                success: false,
                message: 'Quest not found or unauthorized'
            });
        }
        
        // Update fields
        if (title) quest.title = title;
        if (description !== undefined) quest.description = description;
        if (questType) quest.questType = questType;
        if (targetValue) quest.targetValue = Number(targetValue);
        if (points) quest.points = Number(points);
        if (status) quest.status = status;
        if (expiresAt !== undefined) {
            quest.expiresAt = expiresAt ? new Date(expiresAt) : null;
        }
        
        await quest.save();
        
        res.status(200).json({
            success: true,
            message: 'Quest updated successfully',
            data: quest
        });
    } catch (error) {
        console.error('Error updating quest:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update quest',
            error: error.message
        });
    }
};

// Delete a quest
exports.deleteQuest = async (req, res) => {
    const { questId } = req.params;

    try {
        // Attempt to find and delete the quest
        const quest = await Quest.findByIdAndDelete(questId);
        if (!quest) {
            return res.status(404).json({ message: 'Quest not found.' });
        }

        // Update Teacher's quest list to remove the deleted quest


        res.status(200).json({ message: 'Quest deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quest.', error: error.message });
    }
};


// Complete a quest (for students)
exports.completeQuest = async (req, res) => {
    try {
        const questId = req.params.questId;
        const studentId = req.body.studentId;
        
        // Find the quest
        const quest = await Quest.findById(questId);
        if (!quest) {
            return res.status(404).json({
                success: false,
                message: 'Quest not found'
            });
        }
        
        // Check if the quest is active
        if (quest.status !== 'Active') {
            return res.status(400).json({
                success: false,
                message: 'This quest is no longer active'
            });
        }
        
        // Check if the quest has expired
        if (quest.expiresAt && quest.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'This quest has expired'
            });
        }
        
        // Check if the student has already completed the quest
        const alreadyCompleted = quest.completions && 
        quest.completions.some(completion => 
            completion.studentId.toString() === studentId.toString()
        );
    
    if (alreadyCompleted) {
        return res.status(400).json({
            success: false,
            message: 'You have already completed this quest'
        });
    }
        // Get the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        // Verify that the student belongs to the teacher who created the quest
        if (student.teacherId.toString() !== quest.teacherId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not eligible for this quest'
            });
        }
        
        // Check if the student has met the requirements
        let requirementsMet = false;
        
        switch (quest.questType) {
            case 'complete_quizzes':
                // Count completed quizzes
                const completedQuizzes = await Quiz.countDocuments({
                    teacherId: quest.teacherId,
                    'studentAnswers.studentId': studentId,
                    'studentAnswers.status': 'Completed'
                });
                requirementsMet = completedQuizzes >= quest.targetValue;
                break;
                
            case 'score_percentage':
                // Calculate average score percentage across all quizzes
                const quizzes = await Quiz.find({
                    teacherId: quest.teacherId,
                    'studentAnswers.studentId': studentId,
                    'studentAnswers.status': 'Completed'
                });
                
                if (quizzes.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'You need to complete at least one quiz'
                    });
                }
                
                let totalScore = 0;
                let totalPossible = 0;
                
                quizzes.forEach(quiz => {
                    const studentAnswer = quiz.studentAnswers.find(
                        answer => answer.studentId.toString() === studentId.toString()
                    );
                    
                    if (studentAnswer) {
                        totalScore += studentAnswer.totalScore;
                        totalPossible += quiz.totalPoints;
                    }
                });
                
                const averagePercentage = (totalScore / totalPossible) * 100;
                requirementsMet = averagePercentage >= quest.targetValue;
                break;
                
            case 'earn_points':
                // Check total points earned
                requirementsMet = student.pointsEarned >= quest.targetValue;
                break;
        }
        
        if (!requirementsMet) {
            return res.status(400).json({
                success: false,
                message: 'You have not met the requirements for this quest'
            });
        }
        
        // Add the completion record
        quest.completions.push({
            studentId,
            pointsAwarded: quest.points
        });
        
        await quest.save();
        
        // Update student's points
        student.points += quest.points;
        student.pointsEarned += quest.points;
        await student.save();
        
        res.status(200).json({
            success: true,
            message: `Congratulations! You completed the quest and earned ${quest.points} points!`,
            data: {
                quest,
                pointsAwarded: quest.points,
                totalPoints: student.points
            }
        });
    } catch (error) {
        console.error('Error completing quest:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete quest',
            error: error.message
        });
    }
};

// Get student's quest progress
// Update the getStudentQuestProgress function to track progress per quest
exports.getStudentQuestProgress = async (req, res) => {
    try {
        const studentId = req.params.studentId || req.user._id;
        const student = await Student.findById(studentId).populate('pointsEarned');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        // Get all active quests from the student's teacher
        const quests = await Quest.find({ 
            teacherId: student.teacherId,
            status: 'Active'
        });
        
        // Format quest progress data with customized progress calculation per quest
        const questProgress = await Promise.all(quests.map(async quest => {
            // Check if quest is already completed
            const isCompleted = quest.completions && 
                               quest.completions.some(c => c.studentId.toString() === studentId.toString());
            
            let progress = 0;
            
            if (!isCompleted) {
                // Calculate progress based on quest type and ONLY relevant data for THIS quest
                switch (quest.questType) {
                    case 'complete_quizzes':
                        // Only count quizzes completed AFTER this quest was created
                        const completedQuizzes = await Quiz.countDocuments({
                            teacherId: student.teacherId,
                            'studentAnswers.studentId': studentId,
                            'studentAnswers.status': 'Completed',
                            // Only count quizzes created after this quest was created
                            createdAt: { $gte: quest.createdAt }
                        });
                        progress = Math.min(100, (completedQuizzes / quest.targetValue) * 100);
                        break;
                        
                    case 'score_percentage':
                        // Only calculate average from quizzes taken AFTER this quest was created
                        const relevantQuizzes = await Quiz.find({
                            teacherId: student.teacherId,
                            'studentAnswers.studentId': studentId,
                            'studentAnswers.status': 'Completed',
                            createdAt: { $gte: quest.createdAt }
                        });
                        
                        if (relevantQuizzes.length > 0) {
                            let totalScore = 0;
                            let totalPossible = 0;
                            
                            relevantQuizzes.forEach(quiz => {
                                const studentAnswer = quiz.studentAnswers.find(
                                    answer => answer.studentId.toString() === studentId.toString()
                                );
                                
                                if (studentAnswer) {
                                    totalScore += studentAnswer.totalScore;
                                    totalPossible += quiz.totalPoints;
                                }
                            });
                            
                            const averagePercentage = (totalScore / totalPossible) * 100;
                            progress = Math.min(100, (averagePercentage / quest.targetValue) * 100);
                        }
                        break;
                        
                    case 'earn_points':
                        // For points, track from when quest was created
                        // You may need to add a timestamp to point earnings
                        // For now, we'll use total points but ideally track points earned since quest creation
                        progress = Math.min(100, (student.pointsEarned / quest.targetValue) * 100);
                        break;
                }
            } else {
                progress = 100;
            }
            
            return {
                questId: quest._id,
                title: quest.title,
                description: quest.description,
                questType: quest.questType,
                targetValue: quest.targetValue,
                points: quest.points,
                progress: Math.round(progress),
                isCompleted,
                completedAt: isCompleted ? 
                    quest.completions.find(c => c.studentId.toString() === studentId.toString()).completedAt : 
                    null
            };
        }));
        
        res.status(200).json({
            success: true,
            data: {
                questProgress,
                stats: {
                    totalPointsEarned: student.pointsEarned,
                    currentPoints: student.points
                }
            }
        });
    } catch (error) {
        console.error('Error fetching quest progress:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve quest progress',
            error: error.message
        });
    }
};

// Change quest status (activate/archive)
exports.changeQuestStatus = async (req, res) => {
    try {
        const questId = req.params.questId;
        const { status } = req.body;
        const teacherId = req.user._id;
        
        if (!['Active', 'Archived'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be either "Active" or "Archived"'
            });
        }
        
        const quest = await Quest.findOne({ _id: questId, teacherId });
        if (!quest) {
            return res.status(404).json({
                success: false,
                message: 'Quest not found or unauthorized'
            });
        }
        
        quest.status = status;
        await quest.save();
        
        res.status(200).json({
            success: true,
            message: `Quest status changed to ${status}`,
            data: quest
        });
    } catch (error) {
        console.error('Error changing quest status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change quest status',
            error: error.message
        });
    }
};