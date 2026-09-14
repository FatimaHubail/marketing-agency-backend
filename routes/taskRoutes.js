const express = require('express');
const router = express.Router();

const taskCtrl = require('../controllers/taskCtrl');

router.get('/', taskCtrl.getTasks);
router.post('/', taskCtrl.createTask);
router.put('/:id', taskCtrl.updateTask);

module.exports = router;