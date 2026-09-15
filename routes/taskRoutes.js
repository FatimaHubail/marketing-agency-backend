const express = require('express');
const router = express.Router();

const isStaff = require('../middleware/isStaff');
const taskCtrl = require('../controllers/taskCtrl');

router.get('/', isStaff, taskCtrl.getTasks);
router.post('/', isStaff, taskCtrl.createTask);
router.put('/:id', isStaff, taskCtrl.updateTask);
router.delete('/:id', isStaff, taskCtrl.deleteTask);

module.exports = router;