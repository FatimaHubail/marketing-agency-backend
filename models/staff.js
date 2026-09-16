const mongoose = require("mongoose");

const { CAMPAIGN_TYPES } = require("../constants/campaignTaxonomy");

const staffSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    specialty: {
        type: String,
        enum: CAMPAIGN_TYPES,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("Staff", staffSchema);