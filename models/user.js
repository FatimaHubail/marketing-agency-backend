const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator').default;
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
    enum: ['client', 'campaignManager', 'staff', 'outsource', 'admin'],
    default: 'client',
    required: true,
  },
});

userSchema.set('toJSON', {
  transform: (document, userObj) => {
    delete userObj.password;
  },
});

console.log(uniqueValidator);
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;