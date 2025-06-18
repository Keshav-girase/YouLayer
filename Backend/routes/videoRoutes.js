// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const { submitVideo, approveVideo, updateVideoById } = require('../controllers/videoController');
// const { uploadVideoThumbnailMiddleware } = require('../middleware/uploadMiddleware');
// const { upload } = require('../config/multer')
// console.log("control reach video router");
const { 
    authenticateUser, 
    authorizeRole 
} = require('../middleware/auth');

// upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
// uploadVideoThumbnailMiddleware

router.post('/submit', authenticateUser('manager'), authorizeRole('manager'), submitVideo);  // Route to submit video

router.put('/:role/video/:id', authenticateUser('both'), updateVideoById);


// not Usefull
/**
 * ==========================
 *  Note -- >  add check to ensure have valid oauth token for data api
 * =========================
 */

router.put('/approve/:id', authenticateUser, authorizeRole('creator'), approveVideo);  // Route to approve video

// router.get('/submissions',  pending); // Get/Fetch all pending submission


module.exports = router;

