const Task = require('../models/task');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate({
                path: 'campaignId',
                populate: {
                    path: 'requestId'
                }
            })
            .populate('assignedTo')
            .populate('assignedBy');

        res.status(200).json(tasks);

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const createTask = async (req, res) => {
    try {
        const taskData = {
            ...req.body,
            assignedBy: req.user._id
        };

        // If staff doesn't choose an outsource,
        // assign the task to themselves
        if (req.user.role === "staff" && !taskData.assignedTo) {
            taskData.assignedTo = req.user._id;
        }

        const task = await Task.create(taskData);

        const populatedTask = await Task.findById(task._id)
            .populate({
                path: 'campaignId',
                populate: {
                    path: 'requestId'
                }
            })
            .populate('assignedTo')
            .populate('assignedBy');

        res.status(201).json(populatedTask);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            err: err.message
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate({
                path: 'campaignId',
                populate: {
                    path: 'requestId'
                }
            })
            .populate('assignedTo')
            .populate('assignedBy');

        if (!task) {
            return res.status(404).json({
                err: 'Task not found'
            });
        }

        res.status(200).json(task);

    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                err: 'Task not found'
            });
        }

        res.status(200).json({
            message: 'Task deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
};

const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            $or: [
                { assignedTo: req.user._id },
                { assignedBy: req.user._id }
            ]
        })
            .populate({
                path: 'campaignId',
                populate: {
                    path: 'requestId'
                }
            })
            .populate('assignedTo')
            .populate('assignedBy');

        res.status(200).json(tasks);

    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getMyTasks,
};