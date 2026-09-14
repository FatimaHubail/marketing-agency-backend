const express = require('express');
const router = express.Router();

// middleware
const isClient = require('../../middleware/isClient');
const isCampaignOwner = require('../../middleware/isCampaignOwner');

// ctrl
const clientCampaignCtrl = require('../../controllers/client/clientCampaignCtrl');

// routes
router.get('/', isClient, clientCampaignCtrl.allCampaigns);
router.get('/:id', isClient, isCampaignOwner(), clientCampaignCtrl.show);
router.put('/:id/review', isClient, isCampaignOwner({ status: 'client_review' }), clientCampaignCtrl.review);

module.exports = router;
