const express = require('express');

const router = express.Router();

const isSignedIn = require('../middleware/isSignedIn');
const isStaff = require('../middleware/isStaff');
const isOutsource = require('../middleware/isOutsource');

const taskCtrl = require('../controllers/taskCtrl');

const isStaffOrOutsource = async (req, res, next) => {
    if (req.user.role === 'staff') {
        return isStaff(req, res, next);
    }

    if (req.user.role === 'outsource') {
        return isOutsource(req, res, next);
    }

    return res.status(403).json({
        err: 'Staff or outsource access only'
    });
};

router.get('/', isSignedIn, isStaffOrOutsource, taskCtrl.getTasks);

router.post('/', isSignedIn, isStaff, taskCtrl.createTask);

router.put('/:id', isSignedIn, isStaff, taskCtrl.updateTask);

router.delete('/:id', isSignedIn, isStaff, taskCtrl.deleteTask);

module.exports = router;