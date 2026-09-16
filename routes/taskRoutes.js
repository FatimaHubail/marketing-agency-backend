const express = require('express');

const router = express.Router();

const taskCtrl = require('../controllers/taskCtrl');
const isSignedIn = require('../middleware/isSignedIn');

router.use(isSignedIn);

router.get('/', taskCtrl.getTasks);

router.post('/', taskCtrl.createTask);

router.put('/:id', taskCtrl.updateTask);

router.delete('/:id', taskCtrl.deleteTask);

router.get('/my-tasks',taskCtrl.getMyTasks);

router.get('/campaign/:campaignId', taskCtrl.getCampaignTasks);

module.exports = router;