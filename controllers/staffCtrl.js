const Staff = require("../models/staff");

const getStaff = async (req, res) => {
    try {
        const staff = await Staff.find()
            .populate("userId", "username email");

        res.status(200).json(staff);
    } catch (err) {
        res.status(500).json({
            err: err.message,
        });
    }
};

module.exports = {
    getStaff,
};