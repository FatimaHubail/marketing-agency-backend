const mongoose = require("mongoose");
const { CAMPAIGN_TYPES, ALL_GOALS, PREFERRED_CHANNELS } = require("../constants/campaignTaxonomy");

const campaignRequestSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    campaignType: {
        type: String,
        enum: CAMPAIGN_TYPES,
        required: true,
    },

    goal: {
        type: String,
        enum: ALL_GOALS,
        required: true
    },
    
    notes: {
        type: String
    },

    budget: {
        type: Number,
        required: true,
        min: 0
    },

    preferredChannels: [{
        type: String,
        enum: PREFERRED_CHANNELS,
    }],

    status: {
        type: String,
        enum: ["submitted", "accepted", "rejected"],
        required: true,
        default: "submitted",
    },

    rejectedReason: {
        type: String,
    },
    
}, { timestamps: true });

const CampaignRequest = mongoose.model("CampaignRequest", campaignRequestSchema);
module.exports = CampaignRequest;