const OutSource = require('../models/outSource');

const create = async (req, res) => {
    try {
        const outSource = await OutSource.create(req.body);

        res.status(201).json(outSource);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

const index = async () => {
    try {
        const outSources = await OutSource.find({})

        res.status(200).json(outSources);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

const show = async (req, res) => {
    try {
        const outSource = await OutSource.findById(req.params.id);

        res.status(200).json(outSource);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

const update = async (req, res) => {
    try {
        const outSource = await OutSource.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!outSource) {
            return res.status(404).json({ err: 'Outsource not found' });
        }
        res.status(200).json(outSource);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

const deleteOutSource = async (req, res) => {
    try {
        const outSource = await OutSource.findByIdAndDelete(req.params.id);

        if (!outSource) {
            return res.status(404).json({ err: 'Outsource not found' });
        }

        res.status(200).json({ message: 'Outsource deleted successfully' });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

module.exports = {
    create,
    index,
    show,
    update,
    delete: deleteOutSource
};