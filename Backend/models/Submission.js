// Submission.js
const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100,
    },
    description: {
        type: String,
        maxlength: 5000,
    },
    tags: {
        type: [String],
        validate: {
        validator: function (val) {
            return val.join(",").length <= 500;
        },
        message: "Total tags length must not exceed 500 characters",
        },
    },
    categoryId: {
        type: String,
        required: true,
        match: /^\d+$/,
    },
    defaultLanguage: {
        type: String,
        match: /^[a-z]{2}(-[A-Z]{2})?$/, // e.g., "en", "hi", "en-US"
        default: "en",
    },
    defaultAudioLanguage: {
        type: String,
        match: /^[a-z]{2}(-[A-Z]{2})?$/, // e.g., "en", "hi", "en-US"
        default: "en",
    },
    privacyStatus: {
        type: String,
        enum: ["public", "private", "unlisted"],
        required: true,
        default: "private", // Default privacy status
    },
    license: {
        type: String,
        enum: ["youtube", "creativeCommon"],
        default: "youtube",
    },
    embeddable: {
        type: Boolean,
        default: true,
    },
    publicStatsViewable: {
        type: Boolean,
        default: true,
    },
    selfDeclaredMadeForKids: {
        type: Boolean,
        default: false,
    },
    containsSyntheticMedia: {
        type: Boolean,
        default: false,
    },
    recordingDate: {
        type: Date,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    videoDuration: {
        type: Number,
        min: 0,
        max: 43200, // 12 hours
    },
    videoSize: {
        type: Number,
        min: 0,
        max: 256000, // 250 GB
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending', // Video status during moderation
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager', // Manager's reference
        required: true, // The manager who submitted the video
    },
    submittedFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creator', // Creator's reference
        required: true, // The creator who owns the video
    },
    uploadDate: {
        type: Date,
        default: Date.now, // Date of upload
    },
    createdAt: {
        type: Date,
        default: Date.now, // Record creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Record last update date
    },
}, { timestamps: true });

// Middleware to update the `updatedAt` field before saving
SubmissionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Export the Submission model
module.exports = mongoose.model('Submission', SubmissionSchema);
