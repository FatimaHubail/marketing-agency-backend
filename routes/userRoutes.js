const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/userCtrl');

router.post('/', userCtrl.createUser);
router.put('/:id', userCtrl.updateUser);
router.get('/',userCtrl.getUsers);
router.get('/:id', userCtrl.getOneUser)

module.exports = router;