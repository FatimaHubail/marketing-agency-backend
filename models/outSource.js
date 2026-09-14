const mongoose = require('mongoose');
const User = require('./user');

const OutSourceSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
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
    outSourceType: {
        type: String,
        required: true
    },
    outSourceStatus: {
        type: String,
        requried: true,
        enum: ['unavailable', 'available'],
        default: 'unavailable'
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

const OutSource = mongoose.model('OutSource', OutSourceSchema);
module.exports = OutSource;