const express = require('express');
const { 
    getTeamMembers, 
    // approveVideo, 
    getPendingVideos, 
    getApprovedVideos,
    getRejectVideos,
    // inviteManager, 
    getVideo
} = require('../controllers/creatorController');
const { publishVideo, rejectVideo } = require('../controllers/youtubeUploadController');
const { 
    authenticateUser, 
    authorizeRole 
} = require('../middleware/auth');

const router = express.Router();

// Return list
// list of team member
router.get('/team-members', authenticateUser, authorizeRole('creator'), getTeamMembers);

//list of video
router.get('/videos/approved', authenticateUser('creator'), authorizeRole('creator'), getApprovedVideos);

router.get('/videos/rejected', authenticateUser('creator'), authorizeRole('creator'), getRejectVideos);

router.get('/videos/pending', authenticateUser('creator'), authorizeRole('creator'), getPendingVideos);

// single video detail
router.get('/video/:id', authenticateUser('creator'),  getVideo);

// router.post('/invite', authenticateUser('creator'), authorizeRole('creator'), inviteManager);

// Return do something 
router.post('/publish', authenticateUser('creator'), publishVideo);

router.patch('/:id/reject', authenticateUser('creator'), rejectVideo);

module.exports = router;
