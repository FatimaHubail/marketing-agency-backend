const express = require('express');
const router = express.Router();

const isClient = require('../middleware/isClient');
const isStaff = require('../middleware/isStaff');
const campaignCtrl = require('../controllers/campaignCtrl');

// GET / and GET /:id serve both clients (own campaigns only) and staff/admin
// (all campaigns) - scoped inside the controller since the two roles need
// the same path with different visibility.
router.get('/', campaignCtrl.getCampaigns);
router.get('/:id', campaignCtrl.getCampaign);

router.put('/:id/review', isClient, campaignCtrl.reviewCampaign);
router.put('/:id/advance', isStaff, campaignCtrl.advanceCampaign);

module.exports = router;
