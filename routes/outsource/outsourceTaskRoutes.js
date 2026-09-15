const express = require('express');
const router = express.Router();
const outsourceTaskCtrl = require('../../controllers/outsourceTaskCtrl');
const isStaff = require('../../middleware/isStaff');
const isOutsource = require('../../middleware/isOutsource');
const isTaskOwner = require('../../middleware/isTaskOwner');
const validateOutsourceTask = require('../../middleware/validateOutsourceTask');

router.post('/', isStaff, validateOutsourceTask, outsourceTaskCtrl.createOutsourceTask);
router.get('/', isOutsource, outsourceTaskCtrl.getMyOutsourceTasks);
router.get('/all', isStaff, outsourceTaskCtrl.index);
router.get('/:id', isTaskOwner(), outsourceTaskCtrl.show);
router.put('/:id', isTaskOwner(), outsourceTaskCtrl.update);
router.delete('/:id', isStaff, outsourceTaskCtrl.deleteOutsourceTask);

module.exports = router;
