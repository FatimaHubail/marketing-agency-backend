const mongoose = require('mongoose');

const campaignManagerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const CampaignManager = mongoose.model('CampaignManager', campaignManagerSchema);

module.exports = CampaignManager;
