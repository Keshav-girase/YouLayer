// routes/inviteRoutes.js
const express = require('express');
const router = express.Router();
const { inviteTeamMember, acceptedInvitation } = require('../controllers/inviteController');
const { 
    authenticateUser, 
    authorizeRole 
} = require('../middleware/auth');

// Invite team member (creator only)
router.post(
  '/manager',
  authenticateUser('creator'),
  authorizeRole('creator'),
  inviteTeamMember
);

// Accept invitation (manager only)
router.post(
  '/accept-invitation',
  authenticateUser('manager'),
  authorizeRole('manager'),
  acceptedInvitation
); // url: http://localhost:5000/api/invite/accept-invitation
http://localhost:3000/api/invite/accept-invitation'?token=5f812da72e5da39b87e00f3eef2403a1

module.exports = router;
