const { getVideoStreamFromB2 } = require("../utils/b2Service");

const uploadB2VideoToYouTube = async ({ fileId, requestBody, youtubeClient }) => {
    try {
        const videoStream = await getVideoStreamFromB2(fileId);
        // console.log("Video stream fetched, starting upload...");

        // console.log("Upload started...");
        const response = await youtubeClient.videos.insert({
            part: ["snippet", "status", "recordingDetails"],
            requestBody,
            media: {
                body: videoStream,
            },
            notifySubscribers: false,
            uploadType: 'resumable',
        });

        // console.log("YouTube upload complete:", response);
        return response;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
};

module.exports = {
    uploadB2VideoToYouTube,
};
