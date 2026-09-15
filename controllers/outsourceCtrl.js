const bcrypt = require('bcrypt');
const Outsource = require('../models/outsource');
const User = require('../models/user');

const SALT_ROUNDS = 10;

// Create an outsource account
// For Admin
const createOutSource = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        const { username, email, password, name, phone, contactPerson, serviceTypes, status } = req.body;

        let userId = req.body.userId;

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
            return res.status(400).json({ err: 'Outsource account requires credentials (username, email, password) or a valid userId' });
        }

        if (!name || !phone || !contactPerson || !serviceTypes) {
            return res.status(400).json({ err: 'name, phone, contactPerson, and serviceTypes are required' });
        }

        let outsource;
        try {
            outsource = await Outsource.create({
                userId,
                name,
                phone,
                contactPerson,
                serviceTypes: Array.isArray(serviceTypes) ? serviceTypes : [serviceTypes],
                status: status || 'available'
            });
        } catch (outsourceErr) {
            // Rollback user creation if outsource profile creation fails
            if (username && email && password && userId) {
                await User.findByIdAndDelete(userId);
            }
            throw outsourceErr;
        }

        const populatedOutsource = await Outsource.findById(outsource._id)
            .populate('userId', 'username email role');

        res.status(201).json(populatedOutsource);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

// Display all outsource agencies in the system
// For staff and admin
const index = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        // Verify that the logged-in user is staff or admin
        const currentUser = req.user.role ? req.user : await User.findById(req.user._id);
        if (!currentUser || (currentUser.role !== 'staff' && currentUser.role !== 'admin')) {
            return res.status(403).json({ err: 'Access denied. Only staff and admins can view outsource agencies' });
        }

        const filter = {};
        if (req.query.serviceType) {
            filter.serviceTypes = req.query.serviceType;
        }
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const outsources = await Outsource.find(filter)
            .populate('userId', 'username email role');

        res.status(200).json(outsources);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

// Display details of a specific outsource agency
// For staff, admin, and outsource itself
const show = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        const currentUser = req.user.role ? req.user : await User.findById(req.user._id);
        if (!currentUser) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        const outsource = await Outsource.findById(req.params.id)
            .populate('userId', 'username email role');

        if (!outsource) {
            return res.status(404).json({ err: 'Outsource not found' });
        }

        const isStaffOrAdmin = currentUser.role === 'staff' || currentUser.role === 'admin';
        const isOwnAccount = currentUser.role === 'outsource' && outsource.userId && outsource.userId._id.toString() === currentUser._id.toString();

        if (!isStaffOrAdmin && !isOwnAccount) {
            return res.status(403).json({ err: 'Access denied. Only staff, admins, or the account owner can view outsource details' });
        }

        res.status(200).json(outsource);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

// Update the outsource account
// For admin and the outsource agency owner
const update = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        const currentUser = req.user.role ? req.user : await User.findById(req.user._id);
        if (!currentUser) {
            return res.status(401).json({ err: 'Unauthorized' });
        }

        const outsource = await Outsource.findById(req.params.id);
        if (!outsource) {
            return res.status(404).json({ err: 'Outsource not found' });
        }

        const isAdmin = currentUser.role === 'admin';
        const isOwnAccount = currentUser.role === 'outsource' && outsource.userId?.toString() === currentUser._id.toString();

        if (!isAdmin && !isOwnAccount) {
            return res.status(403).json({ err: 'Access denied. Not authorized to update this outsource account' });
        }

        // Update user credentials if provided
        if (outsource.userId) {
            const userUpdates = {};
            if (req.body.username) userUpdates.username = req.body.username;
            if (req.body.email && typeof req.body.email === 'string') userUpdates.email = req.body.email;
            if (req.body.password) userUpdates.password = bcrypt.hashSync(req.body.password, SALT_ROUNDS);

            if (Object.keys(userUpdates).length > 0) {
                await User.findByIdAndUpdate(outsource.userId, userUpdates, { runValidators: true });
            }
        }

        // Update profile fields
        const allowedFields = ['name', 'phone', 'contactPerson', 'serviceTypes', 'status'];
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                outsource[field] = req.body[field];
            }
        }

        await outsource.save();

        const updatedOutsource = await Outsource.findById(outsource._id)
            .populate('userId', 'username email role');

        res.status(200).json(updatedOutsource);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

// Delete an outsource account
// For Admin only
const deleteOutSource = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ err: 'Unauthorized' });
        }
        const outsource = await Outsource.findByIdAndDelete(req.params.id);

        if (!outsource) {
            return res.status(404).json({ err: 'The outsource is not found' });
        }

        if (outsource.userId) {
            await User.findByIdAndDelete(outsource.userId);
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
