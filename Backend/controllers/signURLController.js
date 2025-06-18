// controllers/uploadController.js
const { getUploadUrl } = require('../utils/b2Service');

// exports.getPresignedURL = async (req, res) => {
//   try {
//     const { filename, fileType } = req.body;
//     const timestamp = Math.floor(Date.now() / 1000);
//     const path = fileType === 'video/mp4' ? 'videos' : 'thumbnails';
//     const objectKey = `${path}/${filename}_${timestamp}`;

//     const { uploadUrl, authorizationToken } = await getUploadUrl(process.env.B2_BUCKET_ID);

//     res.json({
//       uploadUrl,
//       authorizationToken,
//       fileKey: objectKey,
//       fileType,
//     });
//   } catch (error) {
//     console.error('B2 Presigned URL Error:', error.message);
//     res.status(500).json({ error: 'Failed to get upload URL' });
//   }
// };

// /controllers/b2Controller.js

const axios = require('axios');

exports.getPresignedURL = async (req, res) => {
  try {
    const { filename, fileType, creatorId} = req.body;
    const timestamp = Math.floor(Date.now() / 1000);
    const path = fileType === 'video/mp4' ? 'videos' : 'thumbnails';
    const objectKey = `${path}/${creatorId}/${timestamp}_${filename}`;

    // Step 1: Authorize Account
    const authRes = await axios.get('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
      auth: {
        username: process.env.B2_KEY_ID,
        password: process.env.B2_APP_KEY,
      },
    });

    const { apiUrl, authorizationToken } = authRes.data;

    // Step 2: Get Upload URL
    const uploadRes = await axios.post(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
      bucketId: process.env.B2_BUCKET_ID,
    }, {
      headers: {
        Authorization: authorizationToken,
      },
    });

    const { uploadUrl, authorizationToken: uploadAuthToken } = uploadRes.data;

    // Step 3: Return upload URL and token to frontend
    res.json({
      uploadUrl,
      authorizationToken: uploadAuthToken,
      fileKey: objectKey,
      fileType,
    });

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
      // console.error('B2 Presigned URL Error:', err?.response?.data || err.message);
      res.status(500).json({ error: 'Failed to get B2 upload URL' });
    }
  }
};

