const express = require('express');
const authCtrl = require('../controllers/authCtrl');

const router = express.Router();

router.post('/sign-in', authCtrl.login);
router.post('/register', authCtrl.registerClient);

module.exports = router;
