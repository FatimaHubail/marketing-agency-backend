const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const OutSource = require('../models/outsource');
const User = require('../models/user');

const SALT_ROUNDS = 10;

//Create an outsource account
//For the Admin
const createOutSource = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        // Verify that the logged-in user is an admin (populated by isAdmin middleware, with fallback)
        const currentUser = req.user.role ? req.user : await User.findById(req.user._id);
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status(403).json({ err: 'Access denied. Only admin can create an outsource account' });
        }

        const { username, email, password, phone, outSourceType, outSourceStatus } = req.body;

        let userId = req.body.OutSourceId;

        // If username, email, and password are provided, create the User account
        if (username && email && password) {
            const existingUser = await User.findOne({
                $or: [{ username }, { email }]
            });

            if (existingUser) {
                return res.status(409).json({ err: 'Username or email already exists' });
            }

            const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                role: 'outsource'
            });

            userId = newUser._id;
        }

        if (!userId) {
            return res.status(400).json({ err: 'Outsource account requires credentials (username, email, password) or a valid OutSourceId' });
        }

        let outSource;
        try {
            outSource = await OutSource.create({
                OutSourceId: userId,
                name: mongoose.Types.ObjectId.isValid(req.body.name) ? req.body.name : userId,
                email: mongoose.Types.ObjectId.isValid(req.body.email) ? req.body.email : userId,
                phone: phone || req.body.phone,
                outSourceType: outSourceType || req.body.outSourceType,
                outSourceStatus: outSourceStatus || 'available'
            });
        } catch (outsourceErr) {
            // Rollback user creation if outsource profile creation fails
            if (username && email && password && userId) {
                await User.findByIdAndDelete(userId);
            }
            throw outsourceErr;
        }

        const populatedOutsource = await OutSource.findById(outSource._id)
            .populate('OutSourceId', 'username email role')
            .populate('name', 'username')
            .populate('email', 'email');

        res.status(201).json(populatedOutsource);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

//Display all the outsource in the system
//for staff
const index = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        // Verify that the logged-in user is staff or admin
        const currentUser = await User.findById(req.user._id);
        if (!currentUser || (currentUser.role !== 'staff' && currentUser.role !== 'admin')) {
            return res.status(403).json({ err: 'Access denied. Only staff and admins can view outsource agencies' });
        }

        const outSources = await OutSource.find()
            .populate('OutSourceId', 'username email role')
            .populate('name', 'username')
            .populate('email', 'email');

        res.status(200).json(outSources);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};


//Display the details of the outsource
//For staff, outsource and the admin
const show = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        const currentUser = await User.findById(req.user._id);
        if (!currentUser) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        const outSource = await OutSource.findById(req.params.id)
            .populate('OutSourceId', 'username email role')
            .populate('name', 'username')
            .populate('email', 'email');

        if (!outSource) {
            return res.status(404).json({ err: 'Outsource not found' });
        }

        const isStaffOrAdmin = currentUser.role === 'staff' || currentUser.role === 'admin';
        const isOwnAccount = currentUser.role === 'outsource' && outSource.OutSourceId && outSource.OutSourceId._id.toString() === currentUser._id.toString();

        if (!isStaffOrAdmin && !isOwnAccount) {
            return res.status(403).json({ err: 'Access denied. Only staff and admins can view outsource details' });
        }

        res.status(200).json(outSource);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

//Update the outsource account
//For the admin and the outsource
const update = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        const currentUser = await User.findById(req.user._id);
        if (!currentUser) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        const outSource = await OutSource.findById(req.params.id);
        if (!outSource) {
            return res.status(404).json({ err: 'Outsource not found' });
        }

        const isAdmin = currentUser.role === 'admin';
        const isOwnAccount = currentUser.role === 'outsource' && outSource.OutSourceId?.toString() === currentUser._id.toString();

        if (!isAdmin && !isOwnAccount) {
            return res.status(403).json({ err: 'Access denied. Not authorized to update this outsource account' });
        }

        if (outSource.OutSourceId) {
            const userUpdates = {};
            if (req.body.username) userUpdates.username = req.body.username;
            if (req.body.email && typeof req.body.email === 'string') userUpdates.email = req.body.email;
            if (req.body.password) userUpdates.password = bcrypt.hashSync(req.body.password, SALT_ROUNDS);

            if (Object.keys(userUpdates).length > 0) {
                await User.findByIdAndUpdate(outSource.OutSourceId, userUpdates, { runValidators: true });
            }
        }

        const updateData = { ...req.body };
        if (updateData.name && !mongoose.Types.ObjectId.isValid(updateData.name)) {
            delete updateData.name;
        }
        if (updateData.email && !mongoose.Types.ObjectId.isValid(updateData.email)) {
            delete updateData.email;
        }

        const updatedOutsource = await OutSource.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after', runValidators: true })
            .populate('OutSourceId', 'username email role')
            .populate('name', 'username')
            .populate('email', 'email');

        res.status(200).json(updatedOutsource);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

const deleteOutSource = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        const currentUser = req.user.role ? req.user : await User.findById(req.user._id);
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status(403).json({ err: 'Access denied. Only admin can delete an outsource account' });
        }

        const outSource = await OutSource.findByIdAndDelete(req.params.id);

        if (!outSource) {
            return res.status(404).json({ err: 'Outsource not found' });
        }

        if (outSource.OutSourceId) {
            await User.findByIdAndDelete(outSource.OutSourceId);
        }

        res.status(200).json({ message: 'Outsource account deleted successfully' });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

module.exports = {
    create: createOutSource,
    index,
    show,
    update,
    delete: deleteOutSource,
};