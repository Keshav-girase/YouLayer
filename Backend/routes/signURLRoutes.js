
const express = require('express');
const { getPresignedURL } = require('../controllers/signURLController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Route to get a presigned URL for uploading a video
router.post('/generate', authenticateUser('manager'), getPresignedURL); 

module.exports = router;