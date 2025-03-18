const mongoose = require('mongoose');

const purchasedRewardSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },
    rewardId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Reward', 
        required: true 
    },
    rewardName: { type: String, required: true },
    pointsCost: { type: Number, required: true },
    fulfilled: { type: Boolean, default: false },
    teacherId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Teacher', 
        required: true 
    }
}, { timestamps: true });

const PurchasedReward = mongoose.model('PurchasedReward', purchasedRewardSchema);

module.exports = PurchasedReward;