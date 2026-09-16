const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CampaignRequest",
        required: true
    },

    assignedStaffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    outsourcePartnerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    status: {
        type: String,
        enum: ["pending", "in_progress", "completed"],
        required: true,
        default: "pending"
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    budgetSpent: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
}, { timestamps: true });

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;