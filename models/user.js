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
    enum: ['client', 'campaign manager', 'staff', 'out source'],
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