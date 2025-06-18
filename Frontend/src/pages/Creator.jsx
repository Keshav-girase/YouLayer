/* eslint-disable react/prop-types */
// Optimized Creator.jsx with performance improvements and minimized re-renders
import React from 'react';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MonitorPlay, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';
import InviteDialog from '@/components/InviteDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { publishVideo } from '@/api/video';
import PublishProgressDialog from '../components/PublishProgressDialog';
import { RefreshCcw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const variantColor = {
  pending: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
  rejected: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
};

function Creator() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState('pending');
  const [videos, setVideos] = useState([]);
  const [isRedirecting, setIsRedirecting] = useState(false); // Only for YouTube redirect
  const [isFetchingVideos, setIsFetchingVideos] = useState(false); // Only for video API

  // New: cache to store API results and prevent multiple calls
  const [videoCache, setVideoCache] = useState({
    approved: [],
    pending: [],
    rejected: [],
  });

  // New: memoized user data
  const user = useMemo(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const videoCacheRef = useRef({
    approved: [],
    pending: [],
    rejected: [],
  });

  // Fetch videos (uses cache unless forceRefresh is true)
  const fetchVideos = useCallback(async (status, forceRefresh = false) => {
    // console.log("hello from fetch video");

    if (!forceRefresh && videoCacheRef.current[status]?.length > 0) {
      // Use cached data
      setVideos(videoCacheRef.current[status]);
      return;
    }

    try {
      setIsFetchingVideos(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`/creator/videos/${status}`, {
        headers: { Authorization: `${token}` },
      });

      const submissions = res.data.submissions || [];
      videoCacheRef.current[status] = submissions; // Update cache
      setVideos(submissions); // Update UI
    } catch (error) {
      toast.error(`Failed to fetch ${status} videos.`);
    } finally {
      setIsFetchingVideos(false);
    }
  }, []);

  // Whenever tab changes, show cached data (if exists) instantly, then fetch
  useEffect(() => {
    const cachedData = videoCacheRef.current[tab];
    if (cachedData?.length > 0) {
      setVideos(cachedData);
    }
    fetchVideos(tab);
  }, [tab, fetchVideos]);

  const handleConnectYouTubeClick = useCallback(async () => {
    toast('Your session expired. Please connect your YouTube account', {
      duration: 3000,
    });
    try {
      setIsRedirecting(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/o/auth/youtube`, {
        headers: { Authorization: `${token}` },
      });
      window.location.href = response.data.authUrl;
    } catch (error) {
      toast.error('Failed to connect YouTube account. Please try again.');
    } finally {
      setIsRedirecting(false);
    }
  }, []);

  useEffect(() => {
    // New: defer non-critical toast
    if (typeof window !== 'undefined' && window.requestIdleCallback) {
      requestIdleCallback(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('connected') === 'youtube') {
          toast.success('Connected to YouTube successfully!');
        }
      });
    }
  }, []);

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center h-screen bg-background flex-col space-y-2">
        <Spinner size="lg" />
        <p>Redirecting to Google auth page...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 xl:px-0">
      <Helmet>
        <title>Dashboard – YouLayer</title>
      </Helmet>
      <header className="max-w-screen-xl mx-auto py-4 px-4 sm:px-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b">
        <h1 className="text-xl font-semibold text-muted-foreground">Welcome, {user.name}</h1>

        <div className="flex flex-wrap items-center gap-3 justify-start sm:justify-end">
          <Button
            variant="outline"
            className="hover:bg-accent"
            onClick={() => fetchVideos(tab, true)}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <InviteDialog />

          <Button variant="outline" className="hover:bg-accent" onClick={handleConnectYouTubeClick}>
            <MonitorPlay className="mr-2 h-4 w-4" />
            Connect YouTube
          </Button>

          <Avatar>
            <AvatarImage src="https://via.placeholder.com/150" alt="User Avatar" />
            <AvatarFallback>
              {user.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto py-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-1">Overview</h2>
          <p className="text-muted-foreground">Monitor and manage your video approvals.</p>
        </section>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full flex">
            <TabsTrigger value="approved" className="flex-1">
              Approved
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">
              Pending
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex-1">
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approved">
            <MemoVideoSection
              videos={videoCacheRef.current.approved}
              variant="approved"
              isLoading={isFetchingVideos && tab === 'approved'}
              onRefetch={() => fetchVideos('approved', true)}
              handleConnectYouTubeClick={handleConnectYouTubeClick}
            />
          </TabsContent>

          <TabsContent value="pending">
            <MemoVideoSection
              videos={videoCacheRef.current.pending}
              variant="pending"
              isLoading={isFetchingVideos && tab === 'pending'}
              onRefetch={() => fetchVideos('pending', true)}
              handleConnectYouTubeClick={handleConnectYouTubeClick}
            />
          </TabsContent>

          <TabsContent value="rejected">
            <MemoVideoSection
              videos={videoCacheRef.current.rejected}
              variant="rejected"
              isLoading={isFetchingVideos && tab === 'rejected'}
              onRefetch={() => fetchVideos('rejected', true)}
              handleConnectYouTubeClick={handleConnectYouTubeClick}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

const VideoSection = ({ videos, variant, isLoading, onRefetch, handleConnectYouTubeClick }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 items-center justify-center mt-20 bg-background">
        <Spinner size="lg" className="bg-black dark:bg-white" />
        <p>Wait while fetching videos from server</p>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="flex items-center justify-center mt-10 bg-background">
        <p className="text-muted-foreground">No videos found.</p>
      </div>
    );
  }

  return (
    <section className="space-y-6 mt-6">
      {videos.map(video => (
        <MemoVideoCard
          key={video._id}
          id={video._id}
          thumbnail={video.thumbnailUrl}
          title={video.title}
          status={video.status}
          variant={variant}
          updatedAt={video.updatedAt}
          onRefetch={onRefetch}
          handleConnectYouTubeClick={handleConnectYouTubeClick}
        />
      ))}
    </section>
  );
};

const MemoVideoSection = React.memo(VideoSection);

const VideoCard = ({
  id,
  thumbnail,
  title,
  status,
  variant,
  updatedAt,
  youtubeUrl,
  onRefetch,
  handleConnectYouTubeClick,
}) => {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [publishError, setPublishError] = useState(null);

  const handlePublish = async () => {
    const token = localStorage.getItem('token');
    
    try {
      setIsPublishing(true);
      setDialogOpen(true);
      setUploadProgress(0);
      
      const res = await publishVideo(id, token, (progress) => setUploadProgress(progress));

      if (res?.status === 200) {
        setUploadProgress(100);
        toast.success('Video published successfully!');
        if (typeof onRefetch === 'function') {
          onRefetch();
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message || err.message;

        if (status === 404 && message === "Creator not connected to YouTube") {
          setPublishError("You are not connected to YouTube. Please connect your YouTube account.");
          toast('You are not connected to YouTube. Redirecting to connect...', {
            duration: 3000,
          });
          setTimeout(() => {
            handleConnectYouTubeClick();
          }, 6000);
        } else {
          toast.error('Failed to publish video.');
          setPublishError(message || "Unknown Axios error");
        }
      } else {
        // console.error('Non-Axios error:', err);
        toast.error('Something went wrong.');
        setPublishError(err?.message || "Unknown error");
      }

      setUploadProgress(0);
    } finally {
      setTimeout(() => {
        setDialogOpen(false);
      }, 6000);
      setIsPublishing(false);
    }
  };

  const handleReject = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `/creator/${id}/reject`,
        {},
        {
          headers: { Authorization: `${token}` },
        }
      );
      toast.success('Video rejected successfully!');
      if (typeof onRefetch === 'function') {
        onRefetch(); // to reload the videos after rejecting
      }
    } catch (err) {
      toast.error('Failed to reject video.');
    }
  };

  return (
    <div className="rounded-xl p-4 shadow-sm hover:shadow-md transition bg-card flex flex-col md:flex-row gap-6 border border-input">
      <div className="w-full md:w-[280px] h-[160px] flex-shrink-0 rounded-xl overflow-hidden">
        <img
          src={thumbnail}
          alt="Video Thumbnail"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-muted-foreground hover:text-foreground transition">
            {title}
          </h3>

          <div className="flex items-center gap-4 mt-2">
            <span className={`text-sm font-medium px-2 py-1 rounded-md ${variantColor[variant]}`}>
              {status}
            </span>

            <span className="text-xs text-muted-foreground italic">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        {variant === 'pending' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            <Button variant="outline" className="text-sm text-green-600 dark:text-green-400">
              <AlertDialog>
                <AlertDialogTrigger className="flex items-center" asChild>
                  <button disabled={isPublishing}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Publish Video
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Publishing</AlertDialogTitle>
                    <AlertDialogDescription>
                      You're about to publish this video directly to the linked YouTube channel.
                      This action is irreversible.
                      <br />
                      <strong>Ensure video title and details are correct.</strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePublish}>Yes, Publish Now</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Button>

            <Button variant="outline" className="text-sm text-red-600 dark:text-red-400">
              <AlertDialog>
                <AlertDialogTrigger className="flex items-center" asChild>
                  <button disabled={isPublishing}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                    <AlertDialogDescription>
                      You're about to <strong>reject</strong> this video submission. This action
                      cannot be undone.
                      <br />
                      Make sure you've reviewed the video content and details before rejecting.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReject}>Yes, Reject Video</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Button>
            <Button
              variant="outline"
              className="text-sm text-yellow-600 dark:text-yellow-400"
              onClick={() => navigate(`/creator/dashboard/videos/${id}/review`)}
            >
              <Clock className="mr-2 h-4 w-4" />
              Review
            </Button>

            <PublishProgressDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              progress={uploadProgress}
              error={publishError}
            />
          </div>
        )}
        {/* {(variant === "rejected" || variant === "approved") && (
          <div className="flex justify-end items-end mt-2">
            <span className="text-xs text-muted-foreground italic">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </span>
          </div>
        )} */}
      </div>
    </div>
  );
};

const MemoVideoCard = React.memo(VideoCard);

export default Creator;
