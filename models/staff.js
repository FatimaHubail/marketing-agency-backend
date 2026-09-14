const mongoose = require("mongoose");
const { CAMPAIGN_TYPES } = require("../constants/campaignTaxonomy");
const { DEPARTMENT_KEYS } = require("../constants/departments");

const staffSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        departmentKey: { type: String, enum: DEPARTMENT_KEYS, required: true },
        specialties: { type: [String], enum: CAMPAIGN_TYPES, default: [] },
    }
);

module.exports = mongoose.model("Staff", staffSchema);