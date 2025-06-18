// routes/authRoutes.js
const express = require('express');
const { loginCreator, loginManager } = require('../controllers/authController');
const { signupCreator, signupManager } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const Creator = require('../models/Creator');
const Manager = require('../models/Manager');

const router = express.Router();

// Route for Creator signup
router.post('/creator/signup', signupCreator);

// Route for Creator login
router.post('/creator/login', loginCreator);

// Route for Manager signup
router.post('/manager/signup', signupManager);

// Route for Manager login
router.post('/manager/login', loginManager);

router.post('/verify', async (req, res) => {
    // Placeholder for verification logic
    const authHeader = req.headers.Authorization || req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const allowedRole = req.body.allowedRole;
    // console.log(token, allowedRole);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    try {
        // Verify the token and extract user information
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decode token",decoded);
        const userId = decoded.id;

        // Check if the user has the allowed role
        if (allowedRole && decoded.role !== allowedRole) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        // Fetch user details based on role
        let user;
        if (decoded.role === 'creator') {
            user = await Creator.findById(userId);
        } else if (decoded.role === 'manager') {
            user = await Manager.findById(userId);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user information to request object
        return res.status(200).json({ 
            message: 'User verified', 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: decoded.role,
                verified: true, 
            } 
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }

});

// ---------- Submit routes for manager -----------



module.exports = router;
