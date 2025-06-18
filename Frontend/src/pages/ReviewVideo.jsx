/* eslint-disable react/react-in-jsx-scope */
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DateTimePicker from '@/components/ui/DateTimePicker';
import { Checkbox } from '@/components/ui/checkbox';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft } from 'lucide-react';
import { reviewVideoFormSchema } from '@/validation/reviewVideoFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import PublishProgressDialog from '@/components/PublishProgressDialog';
import { publishVideo } from '@/api/video';
import { Helmet } from 'react-helmet-async';

const categories = [
  { label: 'Film & Animation', value: '1' },
  { label: 'Autos & Vehicles', value: '2' },
  { label: 'Music', value: '10' },
  { label: 'Pets & Animals', value: '15' },
  { label: 'Sports', value: '17' },
  { label: 'Short Movies', value: '18' },
  { label: 'Travel & Events', value: '19' },
  { label: 'Gaming', value: '20' },
  { label: 'Videoblogging', value: '21' },
  { label: 'People & Blogs', value: '22' },
  { label: 'Comedy', value: '23' },
  { label: 'Entertainment', value: '24' },
  { label: 'News & Politics', value: '25' },
  { label: 'Howto & Style', value: '26' },
  { label: 'Education', value: '27' },
  { label: 'Science & Technology', value: '28' },
  { label: 'Nonprofits & Activism', value: '29' },
  { label: 'Movies', value: '30' },
  { label: 'Anime/Animation', value: '31' },
  { label: 'Action/Adventure', value: '32' },
  { label: 'Classics', value: '33' },
  { label: 'Comedy (Movies)', value: '34' },
  { label: 'Documentary', value: '35' },
  { label: 'Drama', value: '36' },
  { label: 'Family', value: '37' },
  { label: 'Foreign', value: '38' },
  { label: 'Horror', value: '39' },
  { label: 'Sci-Fi/Fantasy', value: '40' },
  { label: 'Thriller', value: '41' },
  { label: 'Shorts', value: '42' },
  { label: 'Shows', value: '43' },
  { label: 'Trailers', value: '44' },
];

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'Spanish', value: 'es' },
  { label: 'German', value: 'de' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Chinese (Simplified)', value: 'zh-CN' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Russian', value: 'ru' },
  { label: 'Portuguese', value: 'pt' },
  // Add all 100+ languages here...
];

const license = ['youtube', 'creativeCommon'];

function ReviewVideo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState('');
  const [fetchError, setFetchError] = useState(''); // <-- Add this line
  const [refreshCount, setRefreshCount] = useState(0);

  const form = useForm({
    resolver: zodResolver(reviewVideoFormSchema),
    defaultValues: {
      title: '',
      description: '',
      video: null,
      thumbnail: null,
      tags: [],
      categoryId: '',
      privacyStatus: 'private',
      language: 'en',
      license: 'youtube',
      embeddable: true,
      publicStatsViewable: true,
      selfDeclaredMadeForKids: false,
      containsSyntheticMedia: false,
      recordingDate: null,
      submittedFor: '',
    },
  });

  const role = location.pathname.startsWith('/creator') ? 'creator' : 'manager';
  // console.log('role', role);
  // console.log('form errors:', form.formState.errors);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`/${role}/video/${id}`, {
          headers: { Authorization: `${token}` },
        });

        setVideoUrl(data.videoUrl);
        setThumbnailUrl(data.thumbnailUrl);

        form.reset({
          title: data.title || '',
          description: data.description || '',
          video: data.videoUrl || '',
          thumbnail: data.thumbnailUrl || '',
          tags: data.tags || [],
          categoryId: data.categoryId || '',
          privacyStatus: data.privacyStatus || 'private',
          language: data.language || 'en',
          license: data.license || 'youtube',
          embeddable: data.embeddable ?? true,
          publicStatsViewable: data.publicStatsViewable ?? true,
          selfDeclaredMadeForKids: data.selfDeclaredMadeForKids ?? false,
          containsSyntheticMedia: data.containsSyntheticMedia ?? false,
          recordingDate: data.recordingDate || null,
          submittedFor: data.submittedFor || '', 
        });
        setFetchError('');
      } catch (error) {
        setFetchError(`Failed to fetch video data. ${error.message}`);
        toast.error('Failed to fetch video data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [id, role, refreshCount]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/content/${role}/video/${id}`, data, {
        headers: { Authorization: `${token}` },
      });
      if (res.status === 200) {
        setRefreshCount(c => c + 1);
        toast.success("Video details successfully updated and Publish to YouTube!");
      }
    
      // navigate(`/${role}/dashboard`);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to update video.';
      toast.error(msg);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
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
        setTimeout(() => {
          navigate(`/${role}/dashboard`);
        }, 3000);
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


  const handleConnectYouTubeClick = useCallback(async () => {
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

  const autoResize = e => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const goToDashboard = () => {
    navigate(`/${role}/dashboard`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center h-screen bg-background flex-col space-y-2">
        <Spinner size="lg" />
        <p>Redirecting to Google auth page...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl border border-muted rounded-2xl bg-card shadow-sm  p-8 space-y-6 flex-col items-center justify-center">
          <div className="text-destructive text-lg font-semibold mb-4">{fetchError}</div>
          <Button variant="link" onClick={() => navigate(-1)}>
            Go Back. Try again later
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background">
      <Helmet>
        <title>Review & Edit – YouLayer</title>
      </Helmet>
      <div className="w-full max-w-3xl mb-6">
        <Button
          variant="link"
          onClick={goToDashboard}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      <div className="w-full max-w-3xl border border-muted rounded-2xl bg-card shadow-sm p-8 space-y-6">
        <PublishProgressDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          // progress={uploadProgress}
          error={publishError}
        />

        {/* Heading */}
        <div className="text-center space-y-">
          <h2 className="text-2xl font-semibold text-foreground">Review & Edit Video Details</h2>
          <p className="text-sm text-muted-foreground">
            Choose a file and fill in required metadata to publish your video.
          </p>
        </div>

        <AspectRatio ratio={16 / 9} className="rounded-xl overflow-hidden border border-border ">
          <video
            src={videoUrl}
            poster={thumbnailUrl}
            controls
            className="w-full h-full object-cover"
          />
        </AspectRatio>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                const charCount = field.value?.length || 0;
                const isLimitExceeded = charCount > 100;
                return (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          {...field}
                          placeholder="Enter video title"
                          rows={1}
                          onInput={autoResize}
                          className={`resize-none pb-6 ${isLimitExceeded ? 'border-destructive' : ''}`}
                        />
                        <span className="absolute right-2 bottom-1 text-xs text-muted-foreground">
                          {charCount} / 100
                        </span>
                      </div>
                    </FormControl>
                    {isLimitExceeded && (
                      <p className="text-destructive text-xs mt-1">Character limit exceeded!</p>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                const charCount = field.value?.length || 0;
                const isLimitExceeded = charCount > 5000;
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          {...field}
                          placeholder="Tell viewers about your video"
                          rows={4}
                          onInput={autoResize}
                          className={`pb-6 resize-none overflow-hidden ${isLimitExceeded ? 'border-destructive' : ''}`}
                        />
                        <span className="absolute right-2 bottom-1 text-xs text-muted-foreground">
                          {charCount} / 5000
                        </span>
                      </div>
                    </FormControl>
                    {isLimitExceeded && (
                      <p className="text-destructive text-xs mt-1">Character limit exceeded!</p>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 w-full">
              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => {
                  const charCount = field.value?.reduce((sum, tag) => sum + tag.length, 0) || 0;
                  const isLimitExceeded = charCount > 500;

                  return (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                const newTag = input.trim();
                                if (newTag && !field.value.includes(newTag)) {
                                  const updatedTags = [...field.value, newTag];
                                  field.onChange(updatedTags);
                                  setInput('');
                                }
                              }
                            }}
                            placeholder="Enter tags separated by commas"
                            className={`h-12 pb-6 ${isLimitExceeded ? 'border-destructive' : ''}`}
                          />
                          <span className="absolute right-2 bottom-1 text-xs text-muted-foreground">
                            {charCount} / 500
                          </span>
                        </div>
                      </FormControl>
                      {isLimitExceeded && (
                        <p className="text-destructive text-xs mt-1">Character limit exceeded!</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {field.value.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-accent text-sm px-2 py-1 rounded flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              className="cursor-pointer text-red-500"
                              onClick={() => {
                                const updated = field.value.filter((_, i) => i !== index);
                                field.onChange(updated);
                              }}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Recording Date */}
              <FormField
                control={form.control}
                name="recordingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start space-x-0 space-y-1.5 w-full">
                    <FormControl>
                      <DateTimePicker
                        label="Recording Date & Time"
                        value={field.value}
                        onChange={date => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 w-full">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            {categories.map(category => (
                              <SelectItem key={category.label} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="license"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a License" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>License</SelectLabel>
                            {license.map(license => (
                              <SelectItem key={license} value={license}>
                                {license}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacyStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Choose who can see your video</SelectLabel>
                            <SelectItem value={'public'}>Public</SelectItem>
                            <SelectItem value={'unlisted'}>Unlisted</SelectItem>
                            <SelectItem value={'private'}>Private</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Language</SelectLabel>
                            {languages.map(language => (
                              <SelectItem key={language.value} value={language.value}>
                                {language.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 w-full">
              {/* Category Selection (Fixed Field Name and Values) */}
              {[
                { name: 'embeddable', label: 'Allow embedding' },
                { name: 'publicStatsViewable', label: 'Make stats viewable' },
                { name: 'selfDeclaredMadeForKids', label: 'Made for kids' },
                {
                  name: 'containsSyntheticMedia',
                  label: 'Contains synthetic media (AI-generated)',
                },
              ].map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{label}</FormLabel>
                        <FormDescription>
                          {name === 'embeddable' &&
                            'Allow others to embed your video in their sites.'}
                          {name === 'publicStatsViewable' &&
                            'Allow viewers to see like/view counts.'}
                          {name === 'selfDeclaredMadeForKids' && 'Is this video made for kids?'}
                          {name === 'containsSyntheticMedia' &&
                            'Does this video contain AI-generated content (synthetic media)?'}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="sticky bottom-0 bg-background py-4 border-t mt-10 flex gap-6">
              <Button className="w-full"  type="submit">
                Save Changes
              </Button>
              {role === 'creator' && (
                <Button
                  className="w-full"
                  type="button"
                  disabled={isLoading}
                  onClick={handlePublish}
                >
                  Publish to YouTube
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ReviewVideo;
