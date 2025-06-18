const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const Manager = require('../models/Manager'); 
const Creator = require('../models/Creator'); 
const { compareSync } = require('bcrypt');

const authenticateUser = (allowedRole) => async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, JWT_SECRET); 

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Invalid Token: No ID Found' });
        }

        const roleFromPath = allowedRole === 'both' ? req.params.role : allowedRole;
        if (!roleFromPath || !['creator', 'manager'].includes(roleFromPath)) {
            return res.status(400).json({ message: 'Invalid or missing role in path' });
        }

        let user;
        if (roleFromPath === 'creator') {
            user = await Creator.findById(decoded.id);
        } else if (roleFromPath === 'manager') {
            user = await Manager.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({ message: `Access Denied: ${roleFromPath} not found` });
        }

        req.user = { id: user._id, role: roleFromPath, email:user.email };
        next();
    } catch (err) {
        // console.error("JWT verification error:", err.message);
        res.status(401).json({ message: `Invalid Token: ${err.message}` });
    }
};

function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: `Access Denied: ${role} role required` });
        }
        next();
    };
}

module.exports = { authenticateUser, authorizeRole };

/*   creator
    ---> can view team member
    ---> can approve video
    ---> can view pending video
    ---> invite manager
*/ 

/* Manager
 * --> can view creator that have access 
 * --> upload video's
 * --> can view it's pending video's
 * --> can view it's approves video's
*/