const mongoose = require('mongoose');
const User = require('./user');

const CampaignRequestSchema = new mongoose.Schema({
    clinetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        require: true
    },
    title: {
        type: String,
        require: true
    },
    campaignType: {
        type: String,
        enum: ['social media', 'sem', 'print', 'event'],
        require: true,
    },
    goal: {
        type: String,
        require: true
    },
    notes: {
        type: String,
    },
    budget: {
        type: Number,
        require: true,
        min: 0
    },
    preferredChannels: {
        type: String
    },
    status: {
        type: String,
        enum: ['submitted', 'under review', 'accepted', 'rejected'],
        required: true,
    },
    createdAt: {
        type: Date
    },
    //Extra, doesn't exist in the current ERD
    dueDate: {
        type: Date,
        require: true,
    }
});

const CampaignRequest = mongoose.model('CampaignRequest', CampaignRequestSchema);
module.exports = CampaignRequest;
