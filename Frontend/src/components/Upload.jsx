/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UploadCloud, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
export const Upload = forwardRef(({ video, thumbnail, onSelectVideo, onSelectThumbnail }) => {
  // const [video, setVideo] = useState(null);
  // const [thumbnail, setThumbnail] = useState(null);
  // const [videoPreview, setVideoPreview] = useState('');
  // const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  useEffect(() => {
    if (video) {
      const objectUrl = URL.createObjectURL(video);
      setVideoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Clean up
    } else {
      setVideoPreview('');
    }
  }, [video]);

  useEffect(() => {
    if (thumbnail) {
      const objectUrl = URL.createObjectURL(thumbnail);
      setThumbnailPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Clean up
    } else {
      setThumbnailPreview('');
    }
  }, [thumbnail]);

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (video) URL.revokeObjectURL(video);
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [videoPreview, thumbnailPreview]);

  const handleVideoUpload = event => {
    const selected = event.target.files[0];
    if (selected.size > 250 * 1024 * 1024 * 1024) {
      alert('Video size must be less than 250GB');
      return;
    }
    // setVideo(selected);
    // setVideoPreview(URL.createObjectURL(selected));
    onSelectVideo(selected);
  };

  const handleThumbnailUpload = event => {
    const selected = event.target.files[0];
    if (selected.size > 5 * 1024 * 1024) {
      alert('Thumbnail must be less than 5MB');
      return;
    }
    // setThumbnail(selected);
    // setThumbnailPreview(URL.createObjectURL(selected));
    onSelectThumbnail(selected);
  };

  // ----------------------------  UPLOAD TO  B2 ----------------------------------

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Video Upload */}
        <Card className="w-full border-dashed border bg-accent/30 transition-colors">
          <CardContent className="flex flex-col items-center justify-center text-center p-4 w-full">
            {videoPreview && (
              <div className="relative w-full">
                <video src={videoPreview} controls className="mb-3 rounded w-full max-h-64" />
                <button
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
                  onClick={() => {
                    // setVideo(null);
                    onSelectVideo(null);
                    if (videoInputRef.current) videoInputRef.current.value = null;
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <Label
              htmlFor="video-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm font-medium">Upload Video</p>
              <p className="text-xs text-muted-foreground">MP4, AVI, MOV (Max 250GB)</p>
            </Label>
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
              ref={videoInputRef}
            />
            {video && <p className="text-xs text-primary mt-2">{video.name}</p>}

            <Button
              className="mt-4 w-full"
              type="button"
              disabled={uploading}
              onClick={() => videoInputRef.current?.click()}
            >
              {uploading ? 'Uploading...' : 'Select Video'}
            </Button>
          </CardContent>
        </Card>

        {/* Thumbnail Upload */}
        <Card className="w-full border-dashed border bg-accent/30 transition-colors">
          <CardContent className="flex flex-col items-center justify-center text-center p-4 w-full">
            {thumbnailPreview && (
              <div className="relative w-full">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="mb-3 rounded w-full max-h-40 object-contain"
                />
                <button
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
                  onClick={() => {
                    // setThumbnail(null);
                    onSelectThumbnail(null);
                    if (thumbnailInputRef.current) thumbnailInputRef.current.value = null;
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <Label
              htmlFor="thumbnail-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm font-medium">Upload Thumbnail</p>
              <p className="text-xs text-muted-foreground">JPG, PNG (Max 5MB)</p>
            </Label>
            <Input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailUpload}
              ref={thumbnailInputRef}
            />
            {thumbnail && <p className="text-xs text-primary mt-2">{thumbnail.name}</p>}

            <Button
              className="mt-4 w-full"
              type="button"
              disabled={uploading}
              onClick={() => thumbnailInputRef.current?.click()}
            >
              {uploading ? 'Uploading...' : 'Select Thumbnail'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
