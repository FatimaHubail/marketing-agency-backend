const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid Email Address']
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    //Updated the role to enum, added and admin role, so their is an account to create the c.m, staff, and out source agency account, and reject or approve the campaign requests
    //changed the names in the enum to camel case
    enum: ['client', 'campaignManager', 'staff', 'outsource', 'admin'],
    default: 'client',
    required: true,
  },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
});

userSchema.set('toJSON', {
  transform: (document, userObj) => {
    delete userObj.password;
  },
});

clientSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;