// src/utils/uploadToB2.js
import axios from 'axios';

/**
 * Upload a file to B2 using a presigned URL with real-time progress tracking.
 *
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Callback for upload progress (0–100)
 * @param {Function} onSuccess - Callback when upload is successful
 * @param {Function} onError - Callback when upload fails
 */
export async function uploadToB2(file, creatorId, onProgress, onSuccess=null, onError=null) {
  try {
    // 1. Get presigned URL and credentials from backend
    const res = await axios.post(`/presigned-url/generate`, {
        filename: file.name,
        creatorId,
        fileType: file.type,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token')}`,
        }
      }
    );

    const { uploadUrl, authorizationToken, fileKey, fileType } = res.data;

    if (!uploadUrl) throw new Error('No presigned URL returned from server');

    // 2. Upload file directly to B2
    await axios.post(uploadUrl, file, {
      headers: {
        Authorization: authorizationToken,
        'X-Bz-File-Name': encodeURIComponent(fileKey),
        'Content-Type': fileType,
        'X-Bz-Content-Sha1': 'do_not_verify',
      },
      onUploadProgress: progressEvent => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percent);
      },
    });

    // console.log('Uploaded file key:', fileKey);
    if (onSuccess) onSuccess(fileKey); // Optional success callback
    return fileKey;
  } catch (error) {
    // console.error('Upload error:', error);
    if (onError) onError(error);
    throw error; // Let caller handle the error too
  }
}
