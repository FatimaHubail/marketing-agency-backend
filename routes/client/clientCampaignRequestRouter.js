const express = require('express');
const router = express.Router();
const isClient = require('../../middleware/isClient');
const isOwner = require('../../middleware/isOwner');
const vlaidateFields = require('../../middleware/validateFields');
const clientRequestCtrl = require('../../controllers/client/clientCampaignRequestCtrl');

router.get('/', clientRequestCtrl.allRequests );
router.post('/', isClient, vlaidateFields, clientRequestCtrl.create);
router.get('/:id',isClient, isOwner, clientRequestCtrl.show);
router.put('/:id', isClient, isOwner({status: 'submitted'}), vlaidateFields, clientRequestCtrl.update);
router.delete('/:id', clientRequestCtrl.delete)

module.exports = router;