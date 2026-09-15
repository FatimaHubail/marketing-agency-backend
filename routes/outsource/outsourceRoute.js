const express = require('express');
const router = express.Router();

const outsourceCtrl = require('../../controllers/outsourceCtrl');
const isAdmin = require('../../middleware/isAdmin');


//For Only Admin
router.post('/', isAdmin, outsourceCtrl.create);
router.delete('/:id', isAdmin, outsourceCtrl.delete);

router.get('/', outsourceCtrl.index);
router.get('/:id', outsourceCtrl.show);
router.put('/:id', outsourceCtrl.update);

module.exports = router;
