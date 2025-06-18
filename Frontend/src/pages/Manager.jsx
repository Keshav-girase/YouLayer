import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, MailOpen, RefreshCcw, Clock } from 'lucide-react';
import axios from 'axios';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const variantColor = {
  pending: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
  rejected: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
};

function Manager() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('pending');
  const [videos, setVideos] = useState([]);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);

  // Memoized user from localStorage
  const user = useMemo(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  // Using useRef for persistent video cache without triggering re-renders
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
      const res = await axios.get(`/manager/videos/${status}`, {
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

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 xl:px-0">
      <Helmet>
        <title>Dashboard – YouLayer</title>
      </Helmet>
      {/* Header */}
      <header className="max-w-screen-xl mx-auto py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b">
        <div>
          <h1 className="text-xl font-semibold text-muted-foreground">Welcome, {user.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hover:bg-accent"
            onClick={() => fetchVideos(tab, true)}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="hover:bg-accent"
            onClick={() =>
              navigate('/manager/dashboard/upload', {
                state: { isAuthenticated: true },
              })
            }
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline" className="hover:bg-accent">
            <MailOpen className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Avatar>
            <AvatarImage src="https://via.placeholder.com/150" alt="User Avatar" />
            <AvatarFallback>
              {user.name
                ?.split(' ')
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
            />
          </TabsContent>

          <TabsContent value="pending">
            <MemoVideoSection
              videos={videoCacheRef.current.pending}
              variant="pending"
              isLoading={isFetchingVideos && tab === 'pending'}
              onRefetch={() => fetchVideos('pending', true)}
            />
          </TabsContent>

          <TabsContent value="rejected">
            <MemoVideoSection
              videos={videoCacheRef.current.rejected}
              variant="rejected"
              isLoading={isFetchingVideos && tab === 'rejected'}
              onRefetch={() => fetchVideos('rejected', true)}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function VideoCard({ id, thumbnail, title, status, variant, updatedAt }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-xl p-4 shadow-sm hover:shadow-md transition bg-card flex flex-col md:flex-row gap-6  border border-input">
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
            <Button
              variant="outline"
              className="text-sm text-yellow-600 dark:text-yellow-400"
              onClick={() => navigate(`/manager/dashboard/videos/${id}/review`)}
            >
              <Clock className="mr-2 h-4 w-4" />
              Review and Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
const MemoVideoCard = React.memo(VideoCard);

const VideoSection = ({ videos, variant, isLoading, onRefetch }) => {
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
        />
      ))}
    </section>
  );
};

const MemoVideoSection = React.memo(VideoSection);

export default Manager;
