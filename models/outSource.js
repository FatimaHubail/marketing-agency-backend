const mongoose = require('mongoose');
const User = require('./user');

const OutSourceSchema = new mongoose.Schema({
    OutSourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    phone:{
        type: String,
        require: true
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
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const OutSource = mongoose.model('OutSource', OutSourceSchema);
module.exports = OutSource;