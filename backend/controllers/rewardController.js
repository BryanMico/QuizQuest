const Reward = require("../models/rewardModel");
const Student = require("../models/studentModel");
const PurchasedReward = require("../models/purchaseModel");
// Create Reward Controller
exports.createReward = async (req, res) => {
    const { rewardName, description, points, stocks, category, image, teacherId, createdBy } = req.body;

    // Validation
    if (!rewardName || !points || !stocks || !category || !teacherId) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const newReward = new Reward({
            rewardName,
            description,
            points,
            stocks,
            category,
            image,
            teacherId,
            createdBy
        });

        await newReward.save();
        res.status(201).json({ message: "Reward created successfully!", reward: newReward });
    } catch (error) {
        console.error("Error creating reward:", error);
        res.status(500).json({ error: "Failed to create reward." });
    }
};

exports.getTeacherRewards = async (req, res) => {
    const { teacherId } = req.params; // Assuming teacherId is passed in the URL

    try {
        const rewards = await Reward.find({ teacherId }).populate('createdBy', 'name');
        if (!rewards.length) {
            return res.status(404).json({ message: "No rewards found for this teacher." });
        }

        res.status(200).json(rewards);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve rewards." });
    }
};

// Remove Reward Controller
exports.removeReward = async (req, res) => {
    const { rewardId } = req.params;

    try {
        const reward = await Reward.findById(rewardId);
        
        if (!reward) {
            return res.status(404).json({ error: "Reward not found." });
        }

        await Reward.findByIdAndDelete(rewardId);
        res.status(200).json({ message: "Reward deleted successfully!" });
    } catch (error) {
        console.error("Error deleting reward:", error);
        res.status(500).json({ error: "Failed to delete reward." });
    }
};

// Edit Reward Controller
exports.editReward = async (req, res) => {
    const { rewardId } = req.params;
    const { rewardName, description, points, stocks, category, image } = req.body;

    // Validation
    if (!rewardName || !points || !stocks || !category) {
        return res.status(400).json({ error: "Required fields missing." });
    }

    try {
        const reward = await Reward.findById(rewardId);
        
        if (!reward) {
            return res.status(404).json({ error: "Reward not found." });
        }

        const updatedReward = await Reward.findByIdAndUpdate(
            rewardId,
            {
                rewardName,
                description,
                points,
                stocks,
                category,
                image,
                updatedAt: Date.now()
            },
            { new: true } // Return the updated document
        );

        res.status(200).json({ 
            message: "Reward updated successfully!", 
            reward: updatedReward 
        });
    } catch (error) {
        console.error("Error updating reward:", error);
        res.status(500).json({ error: "Failed to update reward." });
    }
};

exports.buyReward = async (req, res) => {
    const { studentId, rewardId } = req.body;

    try {
        // Find the student and reward
        const student = await Student.findById(studentId);
        const reward = await Reward.findById(rewardId);

        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }

        if (!reward) {
            return res.status(404).json({ error: "Reward not found." });
        }

        // Check if reward is in stock
        if (reward.stocks <= 0) {
            return res.status(400).json({ error: "Reward is out of stock." });
        }

        // Check if student has enough points
        if (student.points < reward.points) {
            return res.status(400).json({ 
                error: "Not enough points.", 
                required: reward.points, 
                available: student.points 
            });
        }

        // Create a transaction (you might want to use MongoDB transactions here)
        
        // Deduct points from student
        student.points -= reward.points;
        student.pointsSpent += reward.points;
        await student.save();

        // Reduce stock
        reward.stocks -= 1;
        await reward.save();

        // Record the purchase
        const purchasedReward = new PurchasedReward({
            studentId: student._id,
            rewardId: reward._id,
            rewardName: reward.rewardName,
            pointsCost: reward.points,
            teacherId: reward.teacherId
        });

        await purchasedReward.save();

        res.status(200).json({
            message: "Reward purchased successfully!",
            purchasedReward,
            updatedStudent: {
                id: student._id,
                name: student.name,
                points: student.points,
                pointsSpent: student.pointsSpent
            }
        });

    } catch (error) {
        console.error("Error purchasing reward:", error);
        res.status(500).json({ error: "Failed to purchase reward." });
    }
};

// Get Student's Purchased Rewards
exports.getStudentPurchasedRewards = async (req, res) => {
    const { studentId } = req.params;

    try {
        const purchasedRewards = await PurchasedReward.find({ studentId })
            .sort({ createdAt: -1 }) // Sort by most recent first
            .populate('rewardId', 'rewardName description image category');

        res.status(200).json(purchasedRewards);
    } catch (error) {
        console.error("Error retrieving purchased rewards:", error);
        res.status(500).json({ error: "Failed to retrieve purchased rewards." });
    }
};

// Get Teacher's Students' Purchased Rewards
exports.getTeacherStudentsPurchasedRewards = async (req, res) => {
    const { teacherId } = req.params;

    try {
        const purchasedRewards = await PurchasedReward.find({ teacherId })
            .sort({ createdAt: -1 }) // Sort by most recent first
            .populate('studentId', 'name studentID')
            .populate('rewardId', 'rewardName description image category');

        res.status(200).json(purchasedRewards);
    } catch (error) {
        console.error("Error retrieving purchased rewards:", error);
        res.status(500).json({ error: "Failed to retrieve purchased rewards." });
    }
};

// Mark Reward as Fulfilled
exports.fulfillReward = async (req, res) => {
    const { purchaseId } = req.params;

    try {
        const purchasedReward = await PurchasedReward.findById(purchaseId);
        
        if (!purchasedReward) {
            return res.status(404).json({ error: "Purchased reward not found." });
        }

        purchasedReward.fulfilled = true;
        await purchasedReward.save();

        res.status(200).json({ 
            message: "Reward marked as fulfilled", 
            purchasedReward 
        });
    } catch (error) {
        console.error("Error fulfilling reward:", error);
        res.status(500).json({ error: "Failed to fulfill reward." });
    }
};