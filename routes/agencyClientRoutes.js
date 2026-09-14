const express = require('express');
const router = express.Router();

const isClient = require('../middleware/isClient');
const agencyClientCtrl = require('../controllers/agencyClientCtrl');

router.get('/',agencyClientCtrl.getClients);
router.get('/:id', isClient, agencyClientCtrl.getClient);
router.put('/:id', isClient, agencyClientCtrl.updateClient);
router.delete('/:id',agencyClientCtrl.deleteClient);

module.exports = router;