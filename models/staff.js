const mongoose = require("mongoose");
const { CAMPAIGN_TYPES } = require("../constants/campaignTaxonomy");

const staffSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        specialties: { type: [String], enum: CAMPAIGN_TYPES, default: [] },
    }
);

module.exports = mongoose.model("Staff", staffSchema);