/* eslint-disable no-undef */
const Team = require('../models/Team');
const Creator = require('../models/Creator');
const Submission =  require('../models/Submission');
const { getDownloadTokenForPrefix, getDownloadUrl } = require('../utils/b2Service');

// Fetch and return all creators the manager has access to
const getAccessibleCreators = async (req, res) => {
  const managerId = req.user.id;

  try {
    // Find all teams where this manager is a member, and populate the creator info
    const teams = await Team.find({ members: managerId }).populate('creator', 'name email');

    if (!teams.length) {
      return res.status(200).json({ message: 'Manager has no creators access', creators: [] });
    }

    // Extract creator details from each team
    const creators = teams.map(team => ({
      _id: team.creator._id,
      name: team.creator.name,
      email: team.creator.email,
      teamId: team._id,
      teamName: team.name,
    }));

    res.status(200).json({ creators });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch creators', error: err.message });
  }
};

// Fetch and return pending video submissions for the manager
const getPendingVideos = async (req, res) => {
  const  managerId  = req.user.id; // Access user/manager ID;
  try {
    const allowedCreators = await Team.find({ members: managerId }).distinct('creator');

    const submissions = await Submission.find({
      status: 'Pending',
      submittedBy: managerId,
      submittedFor: { $in: allowedCreators },
    });
    // const submissions = await Submission.find({ status: 'Pending', submittedBy: managerId });

    const creatorIds = [...new Set(submissions.map(sub => sub.submittedFor.toString()))];

    // const videoTokenData = {};
    const thumbTokenData = {};

    for (const creatorId of creatorIds) {
      // videoTokenData[creatorId] = await getDownloadTokenForPrefix(`videos/${creatorId}/`);
      thumbTokenData[creatorId] = await getDownloadTokenForPrefix(`thumbnails/${creatorId}/`);
    }

    const updatedSubmissions = submissions.map((sub) => {
      const creatorId = sub.submittedFor.toString();

      // const videoSignedURL = generateSignedUrl(videoTokenData[creatorId].downloadUrl , process.env.B2_BUCKET_NAME, sub.videoUrl, videoTokenData[creatorId].token);
      const thumbSignedURL = generateSignedUrl(thumbTokenData[creatorId].downloadUrl, process.env.B2_BUCKET_NAME, sub.thumbnailUrl, thumbTokenData[creatorId].token)

      return {
        // ...sub.toObject(),
        // videoUrl: videoSignedURL,
        _id: sub._id,
        title: sub.title,
        thumbnailUrl: thumbSignedURL,
        status: sub.status,
        updatedAt: sub.updatedAt,
      };
    });

    res.json({ submissions: updatedSubmissions });

  } catch (err) {
    const isNetworkError = () => {
      if (!err) return false;
      if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') return true;
      if (err?.cause?.code === 'ENOTFOUND' || err?.cause?.code === 'ECONNREFUSED') return true;
      if (typeof err.message === 'string' && (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED'))) return true;
      return false;
    }

    if (isNetworkError()) {
      // Network-related error
      res.status(503).json({ message: "Service unavailable. Please check your internet connection and try again." });
    } else {
      res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
    }
  }
};

// Fetch and return approved videos for the manager
const getApprovedVideos = async (req, res) => {
  const  managerId  = req.user.id; // Access user/manager ID;
  try {
    const submissions = await Submission.find({ status: 'Approved', submittedBy: managerId });
    const creatorIds = [...new Set(submissions.map(sub => sub.submittedFor.toString()))];

    // const videoTokenData = {};
    const thumbTokenData = {};

    for (const creatorId of creatorIds) {
      // videoTokenData[creatorId] = await getDownloadTokenForPrefix(`videos/${creatorId}/`);
      thumbTokenData[creatorId] = await getDownloadTokenForPrefix(`thumbnails/${creatorId}/`);
    }

    const updatedSubmissions = submissions.map((sub) => {
      const creatorId = sub.submittedFor.toString();

      // const videoSignedURL = generateSignedUrl(videoTokenData[creatorId].downloadUrl , process.env.B2_BUCKET_NAME, sub.videoUrl, videoTokenData[creatorId].token);
      const thumbSignedURL = generateSignedUrl(thumbTokenData[creatorId].downloadUrl, process.env.B2_BUCKET_NAME, sub.thumbnailUrl, thumbTokenData[creatorId].token)

      return {
        // ...sub.toObject(),
        // videoUrl: videoSignedURL,
        _id: sub._id,
        title: sub.title,
        thumbnailUrl: thumbSignedURL,
        status: sub.status,
        updatedAt: sub.updatedAt,
      };
    });

    res.json({ submissions: updatedSubmissions });
  } catch (err) {
    const isNetworkError = () => {
      if (!err) return false;
      if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') return true;
      if (err?.cause?.code === 'ENOTFOUND' || err?.cause?.code === 'ECONNREFUSED') return true;
      if (typeof err.message === 'string' && (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED'))) return true;
      return false;
    }

    if (isNetworkError()) {
        // Network-related error
        res.status(503).json({ message: "Service unavailable. Please check your internet connection and try again." });
    } else {
      res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
    }
  }
};

// Fetch and return approved videos for the manager
const getRejectedVideos = async (req, res) => {
  const  managerId  = req.user.id; // Access user/manager ID;
  try {
    const submissions = await Submission.find({ status: 'Rejected', submittedBy: managerId });
    const creatorIds = [...new Set(submissions.map(sub => sub.submittedFor.toString()))];

    // const videoTokenData = {};
    const thumbTokenData = {};

    for (const creatorId of creatorIds) {
      // videoTokenData[creatorId] = await getDownloadTokenForPrefix(`videos/${creatorId}/`);
      thumbTokenData[creatorId] = await getDownloadTokenForPrefix(`thumbnails/${creatorId}/`);
    }

    const updatedSubmissions = submissions.map((sub) => {
      const creatorId = sub.submittedFor.toString();

      // const videoSignedURL = generateSignedUrl(videoTokenData[creatorId].downloadUrl , process.env.B2_BUCKET_NAME, sub.videoUrl, videoTokenData[creatorId].token);
      const thumbSignedURL = generateSignedUrl(thumbTokenData[creatorId].downloadUrl, process.env.B2_BUCKET_NAME, sub.thumbnailUrl, thumbTokenData[creatorId].token)

      return {
        // ...sub.toObject(),
        // videoUrl: videoSignedURL,
        _id: sub._id,
        title: sub.title,
        thumbnailUrl: thumbSignedURL,
        status: sub.status,
        updatedAt: sub.updatedAt,
      };
    });

    res.json({ submissions: updatedSubmissions });
  } catch (err) {
    const isNetworkError = () => {
      if (!err) return false;
      if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') return true;
      if (err?.cause?.code === 'ENOTFOUND' || err?.cause?.code === 'ECONNREFUSED') return true;
      if (typeof err.message === 'string' && (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED'))) return true;
      return false;
    }

    if (isNetworkError()) {
        // Network-related error
        res.status(503).json({ message: "Service unavailable. Please check your internet connection and try again." });
    } else {
      res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
    }
  }
};

const getVideo =  async (req, res) => {
    const id = req.params.id
    // console.log("id from get video",id);
    try {
        const video = await Submission.findById(id);
        
        if (!video) return res.status(404).json({ message: 'Not found' });

        video.videoUrl = await getDownloadUrl(video.videoUrl);
        video.thumbnailUrl = await getDownloadUrl(video.thumbnailUrl);

        res.json(video);
    } catch (err) {
        const isNetworkError = () => {
          if (!err) return false;
          if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') return true;
          if (err?.cause?.code === 'ENOTFOUND' || err?.cause?.code === 'ECONNREFUSED') return true;
          if (typeof err.message === 'string' && (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED'))) return true;
          return false;
        }

        if (isNetworkError()) {
            // Network-related error
          res.status(503).json({ message: "Service unavailable. Please check your internet connection and try again." });
        } else {
          res.status(500).json({ message: 'Server error' });
        }
    }
}

const generateSignedUrl = (baseUrl, bucketName, fileKey, token) => {
  return `${baseUrl}/file/${bucketName}/${fileKey}?Authorization=${token}`;
};



module.exports = { getAccessibleCreators, getVideo, getPendingVideos, getApprovedVideos, getRejectedVideos };