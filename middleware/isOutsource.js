const Outsource = require('../models/outSource');

const isOutsource = async (req, res, next) => {
    if (req.user.role !== 'outsource') {
        return res.status(403).json({ err: 'Outsource access only' });
    }
    const outsource = await Outsource.findOne({ userId: req.user._id });
    if (!outsource) {
        return res.status(404).json({ err: 'Outsource profile not found' });
    }
    req.outsource = outsource;
    next();
};

module.exports = isOutsource;
