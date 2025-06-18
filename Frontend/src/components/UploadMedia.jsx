/* eslint-disable react/display-name */
// UploadMedia.jsx
import { uploadToB2 } from '../utils/uploadToB2';
import CircularProgress from './ui/CircularProgress';
import { useState, forwardRef, useImperativeHandle } from 'react';

// eslint-disable-next-line react/prop-types
const UploadMedia = forwardRef(({ videoFile, thumbnailFile, creatorId }, ref) => {
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [averageProgress, setAverageProgress] = useState(0);

  useImperativeHandle(ref, () => ({
    triggerUpload: async () => {
      if (!videoFile || !thumbnailFile) {
        alert('Both files are required.');
        return;
      }

      // Await both uploads and get their returned keys directly
      const [videoFileKey, thumbnailFileKey] = await Promise.all([
        uploadToB2(videoFile, creatorId, percent => {
          setVideoProgress(percent);
          setAverageProgress(Math.round((percent + thumbnailProgress) / 2))
        }),
        uploadToB2(thumbnailFile, creatorId, percent => {
          setThumbnailProgress(percent);
          setAverageProgress(Math.round((videoProgress + percent) / 2));
        }),
      ]);

      return { videoFileKey, thumbnailFileKey };
    },
  }));

  return (
    <div className="p-4">
      <CircularProgress progress={averageProgress * 2} />
    </div>
  );
});

export default UploadMedia;
