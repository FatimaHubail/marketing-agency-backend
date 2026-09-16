const express = require('express');

const router = express.Router();

const taskCtrl = require('../controllers/taskCtrl');
const isSignedIn = require('../middleware/isSignedIn');

router.use(isSignedIn);

router.get('/', taskCtrl.getTasks);

router.post('/', taskCtrl.createTask);

router.put('/:id', taskCtrl.updateTask);

router.delete('/:id', taskCtrl.deleteTask);

module.exports = router;