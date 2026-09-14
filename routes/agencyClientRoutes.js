const express = require('express');
const router = express.Router();

const agencyClientCtrl = require('../controllers/agencyClientCtrl');

router.get('/',agencyClientCtrl.getClients);

module.exports = router;