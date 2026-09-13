const mongoose = require('mongoose');

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
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    //Updated the role to enum, added and admin role, so their is an account to create the c.m, staff, and out source agency account, and reject or approve the campaign requests
    enum: ['client', 'campaign manager', 'staff', 'out source agency', 'admin'],
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

const User = mongoose.model('User', userSchema);

module.exports = User;