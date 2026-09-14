const express = require('express');
const router = express.Router();

const campaignRequestCtrl = require('../controllers/campaignRequestCtrl');

router.get('/', campaignRequestCtrl.allRequests);
router.get('/:id', campaignRequestCtrl.show);
router.put('/:id', campaignRequestCtrl.update);
router.delete('/:id', campaignRequestCtrl.delete)

module.exports = router;