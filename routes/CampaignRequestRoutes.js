const express = require('express');

const router = express.Router();

const campaignRequestCtrl = require('../controllers/campaignRequestCtrl');

router.get('/', campaignRequestCtrl.getCampaignRequests);

router.get('/:id', campaignRequestCtrl.getCampaignRequest);

router.put('/:id', campaignRequestCtrl.updateCampaignRequest);

router.delete('/:id', campaignRequestCtrl.deleteCampaignRequest);

module.exports = router;