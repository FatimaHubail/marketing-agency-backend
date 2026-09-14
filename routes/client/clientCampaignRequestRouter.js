const express = require('express');
const router = express.Router();
const isClient = require('../middleware/isClient');

const clientRequestCtrl = require('../../controllers/client/clientCampaignRequestCtrl');

router.get('/', clientRequestCtrl.allRequests );
router.post('/', isClient, clientRequestCtrl.create);
router.get('/:id', clientRequestCtrl.show);
router.put('/:id', campaignRequestCtrl.update);
router.delete('/:id', campaignRequestCtrl.delete)

module.exports = router;