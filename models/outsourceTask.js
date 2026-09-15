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
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },

  outsourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Outsource',
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
    //Added 'delivered' status in case the outsourced already delivered the task
    enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'delivered'],
    default: 'pending',
    required: true
  },

  paymentAmount: {
    type: Number,
    required: true
  },

  //In case the outsource provide multiple type of service, the type needed in the task must be specified
  serviceType: {
    type: String,
    required: true,
  },

  rejectionReason: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date
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

