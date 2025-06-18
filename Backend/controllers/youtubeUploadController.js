const { google } = require("googleapis");
const { createOAuth2Client } = require("../config/googleAuth");
const Creator = require("../models/Creator");
const Submission = require("../models/Submission");
const { uploadB2VideoToYouTube } = require("../services/downloadAndUploadToYouTube");

exports.publishVideo = async (req, res) => {
    const { submissionId } = req.body;

    try {
        // 1. Find Submission
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        if (!submission.submittedFor.equals(req.user.id)) {
            // console.log(submission.submittedFor.toString(), req.user.id.toString())
            return res.status(403).json({ message: "Unauthorized to publish this video" });
        }

        // 2. Find Creator
        const creator = await Creator.findById(submission.submittedFor);
        if (!creator || !creator.oauthTokens || !creator.oauthTokens.refresh_token) {
            return res.status(404).json({ message: "Creator not connected to YouTube" });
        }

        const tokens = creator.getDecryptedTokens();
        // console.log("Using tokens:", tokens);

        // 3. Setup OAuth2Client with creator’s tokens
        const oAuth2Client = createOAuth2Client();
        oAuth2Client.setCredentials(tokens);
        
        oAuth2Client.on('tokens', async (newTokens) => {
            if (newTokens.refresh_token) {
                // save BOTH new access and refresh token
                creator.oauthTokens = {
                    ...creator.oauthTokens,
                    ...newTokens,
                };
            } else {
                // only access token updated
                creator.oauthTokens.access_token = newTokens.access_token;
                creator.oauthTokens.expiry_date = newTokens.expiry_date;
            }
            try {
                await creator.save(); // <--- YOU MISSED THIS
            } catch (err) {
                console.error("Failed to save updated tokens:", err);
            }
        });

        // 4. Setup YouTube API client
        const youtube = google.youtube({
            version: "v3",
            auth: oAuth2Client,
        });

        // 5. Prepare YouTube metadata
        const requestBody = {
            snippet: {
                title: submission.title,
                description: submission.description || "",
                tags: submission.tags || [],
                categoryId: submission.categoryId,
                defaultLanguage: submission.defaultLanguage || "en",
                defaultAudioLanguage: submission.defaultAudioLanguage || "en",
            },
            status: {
                privacyStatus: submission.privacyStatus,
                license: submission.license,
                embeddable: submission.embeddable,
                publicStatsViewable: submission.publicStatsViewable,
                selfDeclaredMadeForKids: submission.selfDeclaredMadeForKids,
                containsSyntheticMedia: submission.containsSyntheticMedia || false,
            },
            recordingDetails: submission.recordingDate
                ? { recordingDate: submission.recordingDate }
                : undefined,
        };

        // 6. Publish video to YouTube from B2
        const response = await uploadB2VideoToYouTube({
            fileId: submission.videoUrl,
            requestBody,
            youtubeClient: youtube,
        });

        // console.log("Response of Publish", response)
        submission.status = "Approved"
        await submission.save();
        
        // 7. Send response
        res.status(200).json({
            message: "Video published successfully",
            videoId: response.data.id,
            youtubeUrl: `https://www.youtube.com/watch?v=${response.data.id}`,
        });

    } catch (err) {
        // console.error("Publish error:", error);
        if (err.response?.status === 401) {
            return res.status(401).json({
                message: "Authorization required",
                reauth: true,
                redirectUrl: "<YOUR_GOOGLE_OAUTH_URL>", // TODO: Replace dynamically if needed
            });
        }
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
        } 

        return res.status(500).json({
            message: "Failed to publish video",
            error: err.message,
        });
    }
};

exports.rejectVideo = async (req, res) => {
    const { id } = req.params;

    try {
        const submission = await Submission.findById(id);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        if (!submission.submittedFor.equals(req.user.id)) {
            // console.log(submission.submittedFor.toString(), req.user.id.toString())
            return res.status(403).json({ message: "Unauthorized to publish this video" });
        }
        submission.status = "Rejected";
        await submission.save();

        return res.status(200).json({
            message: "Successfully rejected the video",
            videoId: submission._id,
            status: submission.status,
            updatedAt: submission.updatedAt, 
        }); 
    } catch(err) {
        res.status(500).json({ message: "Failed to reject video", error: err.message });
    }
}
