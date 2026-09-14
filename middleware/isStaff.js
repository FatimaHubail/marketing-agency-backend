const jwt = require('jsonwebtoken');

const STAFF_ROLES = ['staff', 'campaignManager', 'admin'];

function isStaff(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, ... }

        if (!STAFF_ROLES.includes(req.user.role)) {
            return res.status(403).json({ error: 'Staff access only' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = isStaff;
