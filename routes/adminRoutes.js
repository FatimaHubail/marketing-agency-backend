const express = require('express');
const router = express.Router();

const adminCtrl = require('../controllers/adminCtrl');

router.post('/users', adminCtrl.createUser);
router.get('/users',adminCtrl.getUsers);
router.get('/users/:id', adminCtrl.getOneUser);
router.put('/users/:id', adminCtrl.updateUser);
router.delete('/users/:id', adminCtrl.deleteUser);

module.exports = router;