const express = require('express');
const router = express.Router();

const Department = require('../models/department');

router.post('/', async (req, res) => {
  try {
    const department = await Department.create(req.body);

    res.status(201).json(department);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error.message });
  }
});

module.exports = router;