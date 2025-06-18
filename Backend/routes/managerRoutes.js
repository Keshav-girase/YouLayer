const express = require('express');
const router = express.Router();
const { 
    authenticateUser, 
    authorizeRole 
} = require('../middleware/auth');
const { 
    getAccessibleCreators, 
    getPendingVideos, 
    getApprovedVideos,
    getRejectedVideos,
    getVideo
} = require('../controllers/managerController');


router.get('/creators', authenticateUser('manager'), authorizeRole('manager'), getAccessibleCreators); // Fetch all Cretor's

router.get('/videos/pending', authenticateUser('manager'), authorizeRole('manager'), getPendingVideos);

router.get('/videos/approved', authenticateUser('manager'), authorizeRole('manager'), getApprovedVideos);

router.get('/videos/rejected', authenticateUser('manager'), authorizeRole('manager'), getRejectedVideos);

// single video detail
router.get('/video/:id', authenticateUser('manager'),  getVideo);

module.exports = router;