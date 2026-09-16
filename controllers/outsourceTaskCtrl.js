const OutsourceTask = require('../models/outsourceTask');
const Outsource = require('../models/outSource');
const Staff = require('../models/staff');

// Creating Outsource Task to assign them to outsources
// Staff only (guarded by isStaff and validateOutsourceTask)
const createOutsourceTask = async (req, res) => {
    try {
        const { title, description, serviceType, paymentAmount, dueDate, deliverables, outsourceId } = req.body;

        let staffId = req.body.staffId;
        if (!staffId && req.user.role === 'staff') {
            const staff = await Staff.findOne({ userId: req.user._id });
            if (staff) staffId = staff._id;
        }

        if (!staffId) {
            return res.status(400).json({ err: 'Invalid access: staff profile not found' });
        }

        let targetOutsource = await Outsource.findById(outsourceId);
        if (!targetOutsource) {
            targetOutsource = await Outsource.findOne({ userId: outsourceId });
        }

        if (!targetOutsource) {
            return res.status(404).json({ err: 'Outsource partner not found' });
        }

        if (targetOutsource.serviceTypes && !targetOutsource.serviceTypes.includes(serviceType)) {
            return res.status(400).json({
                err: `Outsource partner does not provide '${serviceType}' services`
            });
        }

        const outsourceTask = await OutsourceTask.create({
            staffId,
            outsourceId: targetOutsource._id,
            title,
            description,
            serviceType,
            paymentAmount,
            dueDate,
            deliverables: deliverables || [],
            status: 'pending',
        });

        const populatedTask = await OutsourceTask.findById(outsourceTask._id)
            .populate({
                path: 'staffId',
                populate: { path: 'userId', select: 'username email' }
            })
            .populate('outsourceId');

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

// Outsource agency views tasks assigned to them (guarded by isOutsource)
const getMyOutsourceTasks = async (req, res) => {
    try {
        const tasks = await OutsourceTask.find({ outsourceId: req.outsource._id })
            .populate({
                path: 'staffId',
                populate: { path: 'userId', select: 'username email' }
            })
            .populate('outsourceId')
            .sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

//Show all outsource tasks, 
//Staff and admin
const index = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.serviceType) filter.serviceType = req.query.serviceType;
        if (req.query.outsourceId) filter.outsourceId = req.query.outsourceId;

        const tasks = await OutsourceTask.find(filter)
            .populate({
                path: 'staffId',
                populate: { path: 'userId', select: 'username email' }
            })
            .populate('outsourceId')
            .sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

// View single task details
const show = (req, res) => {
    res.status(200).json(req.outsourceTask);
};

// Update task details
// Only the outsource that the task is assigned to 
const update = async (req, res) => {
    try {
        const updatedTask = await OutsourceTask.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate({
                path: 'staffId',
                populate: { path: 'userId', select: 'username email' }
            })
            .populate('outsourceId');

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

// Delete outsource task
// Only Staff
const deleteOutsourceTask = async (req, res) => {
    try {
        const outsourceTask = await OutsourceTask.findByIdAndDelete(req.params.id);

        if (!outsourceTask) {
            return res.status(404).json({ err: 'Outsource task not found' });
        }

        res.status(200).json({ message: 'Outsource task deleted successfully' });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

module.exports = {
    createOutsourceTask,
    getMyOutsourceTasks,
    index,
    show,
    update,
    delete: deleteOutsourceTask,
    deleteOutsourceTask
};
