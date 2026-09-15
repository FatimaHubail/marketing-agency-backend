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
        enum: ["planning", "in_progress", "client_review", "live", "completed"],
        required: true,
        default: "planning"
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
});

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;