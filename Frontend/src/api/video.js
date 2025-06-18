/* eslint-disable no-useless-catch */
import axios from 'axios';

export const publishVideo = async (submissionId, token, onProgress) => {
  try {
    const response = await axios.post( '/creator/publish', 
      { submissionId },
      {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
        onDownloadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percent);
        },
      }
    );
    return response;
  } catch (error) {
    throw error; // Throw error to handle in calling function
  }
};
