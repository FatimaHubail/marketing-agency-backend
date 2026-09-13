const mongoose = require("mongoose");
const { GOALS_BY_TYPE, CAMPAIGN_TYPES } = require("../constants/campaignTaxonomy");

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
        required: true,
        validate: {
            validator: function (value) {
                const allowedGoals = GOALS_BY_TYPE[this.campaignType];
                return Array.isArray(allowedGoals) && allowedGoals.includes(value);
            },
            message: (props) =>
                `"${props.value}" is not a valid goal for the selected campaign type.`,
        },
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
        type: String
    }],

    status: {
        type: String,
        enum: ["submitted", "under_review", "accepted", "rejected"],
        required: true,
        default: "submitted",
    },

    rejectedReason: {
        type: String,
    },
    
}, { timestamps: true });

const CampaignRequest = mongoose.model("CampaignRequest", campaignRequestSchema);
module.exports = CampaignRequest;