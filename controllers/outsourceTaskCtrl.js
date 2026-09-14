const OutsourceTask = require('../models/outsourceTask');

const create = async (req, res) => {
    try {
        const outsourceTask = await OutsourceTask.create(req.body);

        res.status(201).json(outsourceTask);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

const index = async (req, res) => {
    try {
        const outsourceTasks = await OutsourceTask.find();

        res.status(200).json(outsourceTasks);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

const show = async (req, res) => {
    try {
        const outsourceTask = await OutsourceTask.findById(req.params.id);

        res.status(200).json(outsourceTask);
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
    create,
    index,
    show,
    update,
    delete: deleteOutsourceTask
};
