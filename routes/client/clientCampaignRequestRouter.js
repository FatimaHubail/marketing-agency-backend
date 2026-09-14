const express = require('express');
const router = express.Router();
const isClient = require('../../middleware/isClient');

const campaignRequestCtrl = require('../../controllers/client/clientCampaignRequestCtrl');

router.get('/', campaignRequestCtrl.allRequests);
router.post('/', isClient, campaignRequestCtrl.create);
router.get('/:id', campaignRequestCtrl.show);
router.put('/:id', campaignRequestCtrl.update);
router.delete('/:id', campaignRequestCtrl.delete)

module.exports = router;