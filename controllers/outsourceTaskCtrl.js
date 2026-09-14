const OutsourceTask = require('../models/outsourceTask');

//For the campaign manager
const createOutsourceTask = async (req, res) => {
    try {
        const outsourceTask = await OutsourceTask.create(req.body);

        res.status(201).json(outsourceTask);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

//for the outsource
const index = async (req, res) => {
    try {
        const outsourceTasks = await OutsourceTask.find({ outsourceId: req.user._id });

        res.status(200).json(outsourceTasks);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

//For the outsource and the campgain manager
const show = async (req, res) => {
    try {
        const outsourceTask = await OutsourceTask.findById(req.params.id);

        res.status(200).json(outsourceTask);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};


//To show only the outsrouce task related to the campaign
//This is for the Campaign Manager
const outsourceTasksByCampaign = async (req, res) => {
    try {
        const outsourceTasks = await OutsourceTask.find({ campaignId: req.params.campaignId });

        res.status(200).json(outsourceTasks);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

const update = async (req, res) => {
    try {
        const outsourceTask = await OutsourceTask.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!outsourceTask) {
            return res.status(404).json({ err: 'Outsource task not found' });
        }
        res.status(200).json(outsourceTask);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

//for the campaign manager
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
    index,
    show,
    outsourceTasksByCampaign,
    update,
    delete: deleteOutsourceTask
};
