const express = require('express');
const { authenticateUser } = require('../middleware/auth');

const { getAuthURL, handleOAuthCallback } = require('../controllers/googleAuthController');

const router = express.Router();

router.get('/auth/youtube', authenticateUser('creator'), getAuthURL);  // Start OAuth flow

router.get('/auth/google/callback', handleOAuthCallback);  // Handle OAuth callback

module.exports = router;