const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator').default;
const validator = require('validator');

const addressSchema = new mongoose.Schema({
    building: { type: String, required: true },
    office: { type: String },
    floor: { type: String },
    road: { type: String, required: true },
    block: { type: String, required: true },
    area: { type: String, required: true },
    governorate: {
        type: String,
        enum: ['Capital', 'Muharraq', 'Northern', 'Southern'],
        required: true,
    },
    poBox: { type: String },
}, { _id: false });

const clientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    companyName: {
        type: String,
        required: true,
    },

    industry: {
        type: String,
        required: true
    },

    contactPerson: {
        type: String,
        required: true
    },

    contactEmail: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid Email Address']
    },

    contactPhone: {
        type: String,
        required: true,
    },

    preferredContactMethod: {
        type: String,
        enum: ['email', 'phone', 'whatsapp', 'all'],
        required: true,
    },

    website: {
        type: String,
    },

    socialMediaPlatforms: [{
        platform: { type: String, enum: ['instagram', 'tiktok', 'snapchat', 'twitter', 'linkedin'] },
        url: { type: String },
    }],
    
    targetAudience: {
        type: String
    },

    guideLinesUrl: {
        type: String
    },

    budgetTier: {
        type: String,
        enum: ['small', 'medium', 'enterprise'],
        required: true,
    },

    address: {
        type: addressSchema,
        required: true
    },
});

clientSchema.plugin(uniqueValidator);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;