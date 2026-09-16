const mongoose = require('mongoose');
const User = require('./user');

const OutsourceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    serviceTypes: {
        type: [String], //Assuming that outsourceing company can provide multiple type of services
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    }
});

const Outsource = mongoose.model('Outsource', OutsourceSchema);
module.exports = Outsource;