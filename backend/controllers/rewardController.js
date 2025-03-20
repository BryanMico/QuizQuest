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
    const { studentId, rewardId, quantity = 1 } = req.body; // Default to 1 if quantity not provided

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

        // Check if reward has enough stock
        if (reward.stocks < quantity) {
            return res.status(400).json({ 
                error: "Not enough stock available.", 
                requested: quantity, 
                available: reward.stocks 
            });
        }

        // Calculate total cost
        const totalCost = reward.points * quantity;

        // Check if student has enough points
        if (student.points < totalCost) {
            return res.status(400).json({ 
                error: "Not enough points.", 
                required: totalCost, 
                available: student.points 
            });
        }

        // Deduct points from student
        student.points -= totalCost;
        student.pointsSpent += totalCost;
        await student.save();

        // Reduce stock
        reward.stocks -= quantity;
        await reward.save();

        // Create multiple purchase records if needed
        const purchasedRewards = [];
        
        for (let i = 0; i < quantity; i++) {
            const purchasedReward = new PurchasedReward({
                studentId: student._id,
                rewardId: reward._id,
                rewardName: reward.rewardName,
                pointsCost: reward.points,
                teacherId: reward.teacherId
            });
            
            await purchasedReward.save();
            purchasedRewards.push(purchasedReward);
        }

        res.status(200).json({
            message: `${quantity} reward(s) purchased successfully!`,
            purchasedRewards,
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

// Mark Reward as Fulfilled and Delete
exports.fulfillReward = async (req, res) => {
    const { purchaseId } = req.params;
    
    try {
        // Find and delete the purchased reward
        const deletedReward = await PurchasedReward.findByIdAndDelete(purchaseId);
        
        if (!deletedReward) {
            return res.status(404).json({ error: "Purchased reward not found." });
        }
        
        res.status(200).json({
            message: "Reward fulfilled and deleted successfully",
            purchasedReward: deletedReward
        });
    } catch (error) {
        console.error("Error fulfilling and deleting reward:", error);
        res.status(500).json({ error: "Failed to fulfill and delete reward." });
    }
};