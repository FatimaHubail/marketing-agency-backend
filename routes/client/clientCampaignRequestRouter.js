const express = require('express');
const router = express.Router();

//middlreware
const isClient = require('../../middleware/isClient');
const isOwner = require('../../middleware/isOwner');
const validateFields = require('../../middleware/validateFields');

// ctrl
const clientRequestCtrl = require('../../controllers/client/clientCampaignRequestCtrl');

// routes
router.get('/', isClient, clientRequestCtrl.allRequests );
router.post('/', isClient, validateFields, clientRequestCtrl.create);
router.get('/:id',isClient, isOwner(), clientRequestCtrl.show);
router.put('/:id',
    isClient,
    isOwner({ status: 'submitted' }),
    validateFields,
    clientRequestCtrl.update
);
router.delete('/:id', isClient, isOwner({ status: 'submitted' }), clientRequestCtrl.delete)

module.exports = router;