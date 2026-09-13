const express = require('express');
const router = express.Router();

const campaignRequestCtrl = require('../controllers/campaignRequestCtrl');

router.get('/', campaignRequestCtrl.getCampaignRequest);
router.get('/:id', campaignRequestCtrl.getOneCampaignRequest);

module.exports = router;