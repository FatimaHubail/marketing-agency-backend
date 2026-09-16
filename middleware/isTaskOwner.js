const OutsourceTask = require('../models/outsourceTask');
const Outsource = require('../models/outSource');

function isTaskOwner({ status, outsourceOnly = false } = {}) {
    return async (req, res, next) => {
        try {
            const task = await OutsourceTask.findById(req.params.id)
                .populate({
                    path: 'staffId',
                    populate: { path: 'userId', select: 'username email' },
                })
                .populate('outsourceId');

            if (!task) {
                return res.status(404).json({ err: 'Outsource task not found' });
            }

            const isStaffOrAdmin = req.user.role === 'staff' || req.user.role === 'admin';

            if (req.user.role === 'outsource') {
                const outsource = req.outsource || await Outsource.findOne({ userId: req.user._id });
                if (!outsource || task.outsourceId._id.toString() !== outsource._id.toString()) {
                    return res.status(403).json({ err: 'Not authorized to access this task' });
                }
                req.outsource = outsource;
            } else if (!isStaffOrAdmin || outsourceOnly) {
                return res.status(403).json({ err: 'Access denied. Action reserved for the assigned outsource agency' });
            }

            if (status && task.status !== status) {
                return res.status(400).json({
                    err: `Task must be in '${status}' status to perform this action (currently '${task.status}')`
                });
            }

            req.outsourceTask = task;
            next();
        } catch (err) {
            res.status(500).json({ err: err.message });
        }
    };
}

module.exports = isTaskOwner;
