const Team = require("../models/Team");
const Submission = require('../models/Submission');
const { getDownloadTokenForPrefix, getDownloadUrl } = require('../utils/b2Service');
const bucketId = process.env.B2_BUCKET_ID

// Fetch and return team members associated with the creator
const getTeamMembers = async (req, res) => {
    const creatorId = req.user.id; // Access user ID
    try {
        const teamMembers = await Team.find({ creator: creatorId }).populate('members', 'name email');

        // Respond with the retrieved team members
        res.status(200).json({ message: 'Team members fetched successfully', teamMembers });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch Team Members/Managers', error: err.message });
    }
};

// Fetch and return all approved video submissions
const getApprovedVideos = async (req, res) => { 
    const creatorId = req.user.id; // Access user ID
    try {
        const submissions = await Submission.find({ status: 'Approved', submittedFor: creatorId });

        // const videoTokens = await getDownloadTokenForPrefix(`videos/${creatorId}/`);
        const thumbTokenData = await getDownloadTokenForPrefix(`thumbnails/${creatorId}/`);

        const updatedSubmissions = submissions.map((submission) => ({
            _id: submission._id,
            title: submission.title,
            status: submission.status,
            // videoUrl: generateSignedUrl(videoTokenData.downloadUrl, process.env.B2_BUCKET_NAME, submission.videoUrl, videoTokenData.token),
            thumbnailUrl: generateSignedUrl(thumbTokenData.downloadUrl, process.env.B2_BUCKET_NAME, submission.thumbnailUrl, thumbTokenData.token),
            updatedAt: submission.updatedAt,
        }));

        res.json({ submissions: updatedSubmissions });
    } catch (err) {
        if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || 
            err?.cause?.code === 'ENOTFOUND' || err?.cause?.code === 'ECONNREFUSED') {
            res.status(503).json({ message: "Service unavailable. Please check your internet connection and try again." });
        } else {
            // console.error("Error in getPendingVideos:", err); // Log full error for debugging
            res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
        }
    }
};

// Fetch and return all pending video submissions
const getPendingVideos = async (req, res) => {
    const creatorId = req.user.id;
    try {
        const submissions = await Submission.find({ status: 'Pending', submittedFor: creatorId });

        // console.log("Requesting download auth for:", bucketId );

        // const videoTokenData = await getDownloadTokenForPrefix(`videos/${creatorId}/`);
        const thumbTokenData = await getDownloadTokenForPrefix(`thumbnails/${creatorId}/`);

        const updatedSubmissions = submissions.map((submission) => ({
            _id: submission._id,
            title: submission.title,
            status: submission.status,
            // videoUrl: generateSignedUrl(videoTokenData.downloadUrl, process.env.B2_BUCKET_NAME, submission.videoUrl, videoTokenData.token),
            thumbnailUrl: generateSignedUrl(thumbTokenData.downloadUrl, process.env.B2_BUCKET_NAME, submission.thumbnailUrl, thumbTokenData.token),
            status: submission.status,
            updatedAt: submission.updatedAt,
        }));

        res.json({ submissions: updatedSubmissions });
    } catch (err) {
        if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || 
            err?.cause?.code === 'ENOTFOUND' || err?.cause?.code === 'ECONNREFUSED') {
            res.status(503).json({ message: "Service unavailable. Please check your internet connection and try again." });
        } else {
            // console.error("Error in getPendingVideos:", err); // Log full error for debugging
            res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
        }
    }
};

const getVideo =  async (req, res) => {
    const id = req.params.id
    try {
        const video = await Submission.findById(id);
        
        if (!video) return res.status(404).json({ message: 'Not found' });

        video.videoUrl = await getDownloadUrl(video.videoUrl);
        video.thumbnailUrl = await getDownloadUrl(video.thumbnailUrl);

        res.json(video);
    } catch (err) {
       if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || 
            err?.cause?.code === 'ENOTFOUND' || err?.cause?.code === 'ECONNREFUSED') {
            res.status(503).json({ message: "Service unavailable. Please check your internet connection and try again." });
        } else {
            // console.error("Error in getPendingVideos:", err); // Log full error for debugging
            res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
        }
    }
}

// Logic to send an invitation email to a manager
const getRejectVideos = async (req, res) => {
    const creatorId = req.user.id;
    try {
        const submissions = await Submission.find({ status: 'Rejected', submittedFor: creatorId });

        // console.log("Requesting download auth for:", bucketId );

        // const videoTokenData = await getDownloadTokenForPrefix(`videos/${creatorId}/`);
        const thumbTokenData = await getDownloadTokenForPrefix(`thumbnails/${creatorId}/`);

        const updatedSubmissions = submissions.map((submission) => ({
            // ...submission.toObject(),
            _id: submission._id,
            title: submission.title,
            status: submission.status,
            // videoUrl: generateSignedUrl(videoTokenData.downloadUrl, process.env.B2_BUCKET_NAME, submission.videoUrl, videoTokenData.token),
            thumbnailUrl: generateSignedUrl(thumbTokenData.downloadUrl, process.env.B2_BUCKET_NAME, submission.thumbnailUrl, thumbTokenData.token),
            status: submission.status,
            updatedAt: submission.updatedAt, 
        }));

        res.json({ submissions: updatedSubmissions });
    } catch (err) {
        if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || 
            err?.cause?.code === 'ENOTFOUND' || err?.cause?.code === 'ECONNREFUSED') {
            res.status(503).json({ message: "Service unavailable. Please check your internet connection and try again." });
        } else {
            // console.error("Error in getPendingVideos:", err); // Log full error for debugging
            res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
        }
    }
};

const generateSignedUrl = (baseUrl, bucketName, fileKey, token) => {
  return `${baseUrl}/file/${bucketName}/${fileKey}?Authorization=${token}`;
};

module.exports = { getTeamMembers, getApprovedVideos, getPendingVideos, getVideo, getRejectVideos };