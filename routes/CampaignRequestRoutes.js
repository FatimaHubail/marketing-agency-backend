const express = require('express');
const router = express.Router();

const campaignRequestCtrl = require('../controllers/campaignRequestCtrl');

router.get('/', campaignRequestCtrl.getCampaignRequest);
router.get('/:id', campaignRequestCtrl.getOneCampaignRequest);
router.put('/:id', campaignRequestCtrl.updateCampaignRequest);
router.delete('/:id', campaignRequestCtrl.deleteCampaignRequest)

module.exports = router;