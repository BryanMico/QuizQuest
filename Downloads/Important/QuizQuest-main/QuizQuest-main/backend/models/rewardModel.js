const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    rewardName: { type: String, required: true },
    description: { type: String },  // Not required as it might be optional
    points: { type: Number, required: true },
    stocks: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },  // This is for the image path/reference
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);