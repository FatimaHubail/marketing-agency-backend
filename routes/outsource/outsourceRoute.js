const express = require('express');
const router = express.Router();

const outsourceCtrl = require('../../controllers/outsourceCtrl');


router.post('/', outsourceCtrl.create);
router.get('/', outsourceCtrl.index);
router.get('/:id', outsourceCtrl.show);
router.put('/:id', outsourceCtrl.update);
router.delete('/:id', outsourceCtrl.delete);

module.exports = router;
