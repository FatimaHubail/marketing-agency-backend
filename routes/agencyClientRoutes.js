const express = require('express');
const router = express.Router();

const agencyClientCtrl = require('../controllers/agencyClientCtrl');

router.get('/',agencyClientCtrl.getClients);
router.get('/:id',agencyClientCtrl.getClient);
router.delete('/:id',agencyClientCtrl.deleteClient);

module.exports = router;