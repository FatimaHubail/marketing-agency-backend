const mongoose = require('mongoose');
const { DEPARTMENT_KEYS } = require("../constants/departments");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: DEPARTMENT_KEYS,
    required: true,
    unique: true
  },

  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },


});

module.exports = mongoose.model('Department', departmentSchema);