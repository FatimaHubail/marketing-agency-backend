const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');


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
});

clientSchema.plugin(uniqueValidator);

const Client = mongoose.model('Client', clientSchema);

moudule.exports = Client;