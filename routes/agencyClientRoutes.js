const express = require('express');
const router = express.Router();

const isClient = require('../middleware/isClient');
const isStaff = require('../middleware/isStaff');
const isAdmin = require('../middleware/isAdmin');
const agencyClientCtrl = require('../controllers/agencyClientCtrl');

router.get('/', isStaff, agencyClientCtrl.getClients);
router.get('/:id', isClient, agencyClientCtrl.getClient);
router.put('/:id', isClient, agencyClientCtrl.updateClient);
router.delete('/:id', isAdmin, agencyClientCtrl.deleteClient);

module.exports = router;