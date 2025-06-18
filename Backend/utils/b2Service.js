// b2Service.js
const axios = require('axios');

let b2AuthData = null; // Cache token and endpoints
let b2AuthPromise = null;
let tokenIssuedAt = null;

/**
 * Authorize account with Backblaze B2 and cache the auth data.
 * This token is shared across all users (app-level credential).
 * Token is refreshed only if expired (valid ~24 hours).
 * 
 * MULTI-USER NOTES:
 * - b2AuthData caches auth info globally in memory, shared safely across all requests/users in this app instance.
 * - All users use the same Backblaze app credentials.
 * - Avoids unnecessary repeated auth calls.
 * - Uses b2AuthPromise to prevent race conditions on multiple concurrent auths.
 */

const authorizeAccount = async () => {
    if (b2AuthData && tokenIssuedAt && (Date.now() - tokenIssuedAt < 23 * 60 * 60 * 1000)) {
      return b2AuthData; // still valid
    }
    const credentials = Buffer.from(`${process.env.B2_KEY_ID}:${process.env.B2_APP_KEY}`).toString('base64');

    const response = await axios.get('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
        headers: {
            Authorization: `Basic ${credentials}`,
        },
    });

    b2AuthData = response.data;
    return b2AuthData;
}

/**
 * Get upload URL for the specified bucket.
 * 
 * MULTI-USER NOTES:
 * - Each user upload request will call this function to get upload URL.
 * - URLs are scoped per bucket and valid for a short time.
 * - Using shared b2AuthData for authorization token.
 */
const getUploadUrl = async (bucketId) => {
    if (!b2AuthData) await authorizeAccount();

    const response = await axios.post(
        `${b2AuthData.apiUrl}/b2api/v2/b2_get_upload_url`,
        { bucketId },
        { headers: { Authorization: b2AuthData.authorizationToken } }
    );

    return response.data; // Contains uploadUrl and authorizationToken
}

/**
 * Get a download URL for a specific file, authorized for a limited time.
 * 
 * MULTI-USER NOTES:
 * - Each user downloads their own file by fileName.
 * - Signed URLs generated per request, scoped with limited validity.
 */
const getDownloadUrl = async (fileName, validSeconds = 3600)  => {
    if (!b2AuthData) await authorizeAccount();

    const response = await axios.post(
        `${b2AuthData.apiUrl}/b2api/v2/b2_get_download_authorization`,
        {
          bucketId: process.env.B2_BUCKET_ID,
          fileNamePrefix: fileName, // or "" to allow all files
          validDurationInSeconds: validSeconds,
        },
        {
          headers: { Authorization: b2AuthData.authorizationToken },
        }
    );

    const { authorizationToken } = response.data;

    const downloadUrl = `${b2AuthData.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${fileName}?Authorization=${authorizationToken}`;
    return downloadUrl;
}

/**
 * Get download token and URL for a fileName prefix.
 * Useful for authorizing downloads with a prefix match.
 * 
 * MULTI-USER NOTES:
 * - This allows scoped downloads for user-specific prefixes (e.g., "videos/userId/")
 * - Still uses shared global auth token but scoped URLs ensure users can only access their files.
 */
const getDownloadTokenForPrefix = async (fileNamePrefix, validSeconds = 3600) => {
    if (!b2AuthData) {
        if (!b2AuthPromise) {
          // Start authorization and save promise
          b2AuthPromise = authorizeAccount();
        }
        await b2AuthPromise; // Wait for authorization to complete
        b2AuthPromise = null; // Reset promise after done
    }

    const response = await axios.post(
        `${b2AuthData.apiUrl}/b2api/v2/b2_get_download_authorization`,
        {
          bucketId: process.env.B2_BUCKET_ID,
          fileNamePrefix, // eg. "videos/creatorId/"
          validDurationInSeconds: validSeconds,
        },
        {
          headers: { Authorization: b2AuthData.authorizationToken },
        }
    );

    return {
        token: response.data.authorizationToken ,
        downloadUrl: b2AuthData.downloadUrl
    };
};

/**
 * Download file stream by fileId.
 * Uses axios directly with cached auth token.
 * 
 * MULTI-USER NOTES:
 * - Streams are independent per request.
 * - Node.js event loop handles concurrency.
 * - No shared file data between users.
 */
const getVideoStreamFromB2 = async (fileName) => {
  // 1. Ensure we have auth data
  if (!b2AuthData) await authorizeAccount();

  // 2. Request a download authorization token scoped to this file
  const { authorizationToken: dlToken } = await axios.post(
    `${b2AuthData.apiUrl}/b2api/v2/b2_get_download_authorization`,
    {
      bucketId: process.env.B2_BUCKET_ID,
      fileNamePrefix: fileName,
      validDurationInSeconds: 36000,
    },
    {
      headers: { Authorization: b2AuthData.authorizationToken },
    }
  ).then(res => res.data);


  // 3. Build the correct “download by name” URL
  const url = `${b2AuthData.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${encodeURIComponent(fileName)}?Authorization=${dlToken}`;

  // 4. Fetch as a stream
  const response = await axios.get(url, {
    responseType: "stream",
  });

  // const stream = response.data;

  // stream.on('end', () => {
  //   console.log('Download stream ended.');
  // });

  // stream.on('error', (err) => {
  //   console.error('Download stream error:', err);
  // });

  // console.log("ReadableStream Download Completed")
  return response.data; // ReadableStream
};

/**
 * If you want quick development, easier maintenance, and reliable token management, the B2 SDK is generally better.
 * If you want ultimate control and are comfortable managing tokens and requests yourself, native API can be fine.
 * Native API approach can sometimes allow more low-level control over requests (custom headers, fine-tuned retries).
 */


module.exports = {
    authorizeAccount,
    getUploadUrl,
    getDownloadUrl,
    getDownloadTokenForPrefix,
    getVideoStreamFromB2,
};
