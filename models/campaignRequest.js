const mongoose = require('mongoose');

const CampaignRequestSchema = new mongoose.Schema({
  clinetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  campaignType: {
    type: String,
    enum: ['social media', 'sem', 'print', 'event'],
    required: true
  },

  goal: {
    type: String,
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

  preferredChannels: {
    type: String
  },

  status: {
    type: String,
    enum: ['submitted', 'under review', 'accepted', 'rejected'],
    required: true
  },

  dueDate: {
    type: Date,
    required: true
  }
}, {
    //To record the Time of creation
  timestamps: true
});

const CampaignRequest = mongoose.model(
  'CampaignRequest',
  CampaignRequestSchema
);

module.exports = CampaignRequest;