// Contains logic for handling API requests
// Logic for signup, login, etc.
// Logic for video submissions and approvals
// const { Submission } = require('../models/Submission');
const Submission = require('../models/Submission');
const Team = require('../models/Team');

exports.submitVideo = async (req, res) => {
    // console.log("Enter in submit video")
    try {
        const {
            title,
            description,
            tags,
            categoryId,
            privacyStatus,
            license,
            embeddable,
            publicStatsViewable,
            selfDeclaredMadeForKids,
            containsSyntheticMedia,
            recordingDate,
            videoUrl,
            thumbnailUrl,
            videoDuration,
            videoSize,
            submittedFor,
        } = req.body;


        // Use authenticated user id for submittedBy
        const submittedBy = req.user.id;
        // console.log("Body data", req.body);
        // console.log("submitted BY", submittedBy);

        // Check if the logged-in manager has access to this creator
        if (req.user.role === 'manager') {
            const team = await Team.findOne({
                creator: submittedFor,
                members: submittedBy,
            });
            if (!team) {
                return res.status(403).json({ message: 'You do not have permission to submit for this creator' });
            }
        }

        const submission = new Submission({
            title,
            description,
            tags,
            categoryId,
            privacyStatus,
            license,
            embeddable,
            publicStatsViewable,
            selfDeclaredMadeForKids,
            containsSyntheticMedia,
            recordingDate,
            videoUrl,
            thumbnailUrl,
            videoDuration,
            videoSize,
            submittedBy,
            submittedFor,
            status: 'Pending', // Default moderation status
        });

        await submission.save();

        res.status(200).json({
            message: 'Video submission successful',
            submissionId: submission._id,
            videoUrl: submission.videoUrl,
            thumbnailUrl: submission.thumbnailUrl,
        });
    } catch (error) {
        // console.error('Error during video submission:', error);
        res.status(500).json({ message: 'Failed to submit video', error: error.message });
    }
};

// Update video details
exports.updateVideoById = async (req, res) => {
  const { role, id } = req.params;
  const userId = req.user.id;

  try {
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // if (submission.submittedFor.toString() !== userId && submission.submittedBy.toString() !== userId) {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }

    if (role !== req.user.role) {
      return res.status(403).json({ message: 'Role mismatch between token and path' });
    }

    const updatableFields = [
      'title',
      'description',
      'tags',
      'categoryId',
      'privacyStatus',
      'language',
      'license',
      'embeddable',
      'publicStatsViewable',
      'selfDeclaredMadeForKids',
      'containsSyntheticMedia',
      'recordingDate',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        submission[field] = req.body[field];
      }
    });

    await submission.save();

    return res.status(200).json({ message: 'Video updated successfully' });
  } catch (err) {
    // console.error('Error updating video:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', error: err.message });
    }
    return res.status(500).json({ message: 'Failed to update video', error: err.message });
  }
};


exports.approveVideo = async (req, res) => {
    const { submissionId } = req.body;
    try {
        const submission = await Submission.findById(submissionId);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        submission.status = 'Approved';
        // submission.approvedBy = req.user._id;
        await submission.save();

        // YouTube upload logic here
        res.json({ message: 'Content approved and uploaded', submission });
    } catch (err) {
        res.status(500).json({ message: 'Failed to approve content', error: err.message });
    }
}

// exports.pending = async (req, res) => {
//     try {
//         const submissions = await Submission.find({ status: 'Pending' }).populate('submittedBy', 'name email');
//         res.json({ submissions });
//     } catch (err) {
//         res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
//     }
// };
