const Task = require('../models/task');
const Campaign = require('../models/campaign');

// Keeps a campaign's status in sync with its own task count only - never
// touches 'completed', since that's a manual, staff-driven terminal state.
const syncCampaignStatus = async (campaignId) => {
    if (!campaignId) return;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.status === 'completed') return;

    const taskCount = await Task.countDocuments({ campaignId });
    const nextStatus = taskCount > 0 ? 'in_progress' : 'pending';

    if (campaign.status !== nextStatus) {
        campaign.status = nextStatus;
        await campaign.save();
    }
};

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
        const campaign = await Campaign.findById(req.body.campaignId);

        if (!campaign) {
            return res.status(404).json({ err: 'Campaign not found' });
        }

        if (campaign.status === 'completed') {
            return res.status(400).json({ err: 'Cannot add tasks to a completed campaign' });
        }

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

        await syncCampaignStatus(task.campaignId);

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
        const previousTask = await Task.findById(req.params.id);

        if (!previousTask) {
            return res.status(404).json({
                err: 'Task not found'
            });
        }

        const previousCampaignId = previousTask.campaignId;

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

        const newCampaignId = task.campaignId?._id || task.campaignId;

        if (String(previousCampaignId) !== String(newCampaignId)) {
            await syncCampaignStatus(previousCampaignId);
            await syncCampaignStatus(newCampaignId);
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

        await syncCampaignStatus(task.campaignId);

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
