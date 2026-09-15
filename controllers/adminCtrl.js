const User = require("../models/user");
const Staff = require("../models/staff");
const Outsource = require("../models/outsource");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!["admin", "staff", "outsource"].includes(role)) {
            return res.status(400).json({
                err: "Invalid role",
            });
        }

        const userInDatabase = await User.findOne({ username });

        if (userInDatabase) {
            return res.status(409).json({
                err: "Username already exists",
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 5);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
        });

        if (role === "staff") {
            await Staff.create({
                userId: user._id,
                specialties: req.body.specialties || [],
            });
        }

        if (role === 'outsource') {
            await Outsource.create({
                userId: user._id,
                name: req.body.name,
                phone: req.body.phone,
                contactPerson: req.body.contactPerson,
                serviceTypes: req.body.serviceTypes || [],
                status: req.body.status || 'available',
            });
        }

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const allowedRoles = ['admin', 'staff', 'outsource'];

        let filter = {
            role: { $in: allowedRoles }
        };

        if (req.query.role) {
            if (!allowedRoles.includes(req.query.role)) {
                return res.status(400).json({
                    err: 'Invalid role'
                });
            }

            filter.role = req.query.role;
        }

        let users = await User.find(filter);

        if (req.query.role === 'staff') {
            const staffProfiles = await Staff.find({
                userId: { $in: users.map((user) => user._id) }
            });

            users = users.map((user) => {
                const staff = staffProfiles.find(
                    (profile) => profile.userId.toString() === user._id.toString()
                );

                return {
                    ...user.toObject(),
                    staffId: staff?._id,
                    specialties: staff?.specialties || []
                };
            });
        } else if (req.query.role === 'outsource') {
            const outsourceProfiles = await Outsource.find({
                userId: { $in: users.map((user) => user._id) }
            });

            users = users.map((user) => {
                const outsource = outsourceProfiles.find(
                    (profile) => profile.userId.toString() === user._id.toString()
                );

                return {
                    ...user.toObject(),
                    outsourceId: outsource?._id,
                    name: outsource?.name,
                    phone: outsource?.phone,
                    contactPerson: outsource?.contactPerson,
                    serviceTypes: outsource?.serviceTypes || [],
                    status: outsource?.status
                };
            });
        }

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getOneUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                err: 'User not found'
            });
        }

        let profile = null;

        if (user.role === 'staff') {
            profile = await Staff.findOne({
                userId: user._id
            });
        }

        if (user.role === 'outsource') {
            profile = await Outsource.findOne({
                userId: user._id
            });
        }

        res.status(200).json({
            user,
            profile
        });
    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                err: 'User not found'
            });
        }

        const { username, email, password, role } = req.body;

        if (username) user.username = username;
        if (email) user.email = email;
        if (role) {
            if (!['admin', 'staff', 'outsource'].includes(role)) {
                return res.status(400).json({ err: 'Invalid role' });
            }
            user.role = role;
        }

        if (password) {
            user.password = bcrypt.hashSync(password, 5);
        }

        await user.save();

        if (user.role === 'staff') {
            await Staff.findOneAndUpdate(
                { userId: user._id },
                {
                    specialties: req.body.specialties || []
                },
                { new: true, upsert: true }
            );
        }

        if (user.role === 'outsource') {
            const outsourceUpdate = {};
            if (req.body.name !== undefined) outsourceUpdate.name = req.body.name;
            if (req.body.phone !== undefined) outsourceUpdate.phone = req.body.phone;
            if (req.body.contactPerson !== undefined) outsourceUpdate.contactPerson = req.body.contactPerson;
            if (req.body.serviceTypes !== undefined) outsourceUpdate.serviceTypes = req.body.serviceTypes;
            if (req.body.status !== undefined) outsourceUpdate.status = req.body.status;

            await Outsource.findOneAndUpdate(
                { userId: user._id },
                outsourceUpdate,
                { new: true, upsert: true }
            );
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                err: 'User not found'
            });
        }

        if (user.role === 'staff') {
            await Staff.findOneAndDelete({
                userId: user._id
            });
        }

        if (user.role === 'outsource') {
            await Outsource.findOneAndDelete({
                userId: user._id
            });
        }

        await User.findByIdAndDelete(user._id);

        res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    getOneUser,
    updateUser,
    deleteUser,
};
