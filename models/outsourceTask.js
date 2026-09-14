const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const outsourceTaskSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },

  outsourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OutSource',
    required: true
  },

  campaignManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CampaignManager',
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed'],
    default: 'pending',
    required: true
  },

  rejectionReason: {
    type: String,
    trim: true
  },

  deliverables: [{
    type: String,
    trim: true
  }],

  updates: [updateSchema]
}, {
  timestamps: true
});

const OutsourceTask = mongoose.model('OutsourceTask', outsourceTaskSchema);

module.exports = OutsourceTask;
