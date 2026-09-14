const express = require('express');

const router = express.Router();

const isStaff = require('../middleware/isStaff');
const campaignRequestCtrl = require('../controllers/campaignRequestCtrl');

router.get('/', isStaff, campaignRequestCtrl.getCampaignRequests);

router.get('/:id', isStaff, campaignRequestCtrl.getCampaignRequest);

router.put('/:id', isStaff, campaignRequestCtrl.updateCampaignRequest);

router.put('/:id/assign', isStaff, campaignRequestCtrl.assignCampaignRequest);

router.put('/:id/reject', isStaff, campaignRequestCtrl.rejectCampaignRequest);

router.delete('/:id', isStaff, campaignRequestCtrl.deleteCampaignRequest);

module.exports = router;