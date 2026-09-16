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
})

const taskSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },

    assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},

    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed'],
        default: 'pending',
        required: true
    },

    dueDate: {
        type: Date,
        required: true
    }

}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;