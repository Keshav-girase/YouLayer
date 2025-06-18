/* eslint-disable react/react-in-jsx-scope */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useRef, useEffect } from 'react';
import { uploadFormSchema } from '../validation/uploadFormSchema';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import DateTimePicker from './ui/DateTimePicker';
import { Upload } from './Upload';
import UploadMedia from './UploadMedia';
import axios from 'axios';
import { set } from 'date-fns';
import CreatorsList from './CreatorsList';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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

export function UploadVideo() {
  // State for video file
  const [video, setVideo] = useState(null);
  const videoInputRef = useRef(null);
  // State for thumbnail
  const [thumbnail, setThumbnail] = useState(null);
  const thumbnailInputRef = useRef(null);
  // Input for tags
  const [input, setInput] = useState('');
  // Upload video function
  const [uploading, setUploading] = useState(false);
  // const [submittedFor, setSubmittedFor] = useState('');

  const uploadRef = useRef();
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const navigate = useNavigate();

  // Initialize form with react-hook-form and Zod resolver
  const form = useForm({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: '',
      description: '',
      video: null,
      thumbnail: null,
      tags: [],
      categoryId: '', //
      privacyStatus: 'private',
      language: 'en', // Default language
      license: 'youtube',
      embeddable: true,
      publicStatsViewable: true,
      selfDeclaredMadeForKids: false,
      containsSyntheticMedia: false,
      recordingDate: '', // Optional, can be set later
      submittedFor: '',
    },
  });

  const tags = form.watch('tags'); // Watch tags in form state

  // Handle key press event (Add tags on comma press)
  const handleKeyDown = event => {
    if (event.key === ',') {
      event.preventDefault();
      const trimmedTag = input.trim();
      if (trimmedTag) {
        form.setValue('tags', [...(tags || []), trimmedTag]); // Update form state
        setInput(''); // Clear input
      }
    }
  };

  const removeTag = indexToRemove => {
    form.setValue(
      'tags',
      tags.filter((_, index) => index !== indexToRemove)
    );
  };

  const autoResize = e => {
    e.target.style.height = 'auto'; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height dynamically
  };

  const handleVideoSelect = file => {
    setVideo(file);
    form.setValue('video', file, { shouldValidate: true });
  };
  const handleThumbnailSelect = file => {
    setThumbnail(file);
    form.setValue('thumbnail', file, { shouldValidate: true });
  };

  useEffect(() => {
    const doUpload = async () => {
      // console.log('Data to be uploaded:', form.getValues());
      if (pendingSubmit && uploadRef.current) {
        try {
          const result = await uploadRef.current.triggerUpload();
          // console.log('Returned result:', result);

          const videoFileId = result.videoFileKey;
          const thumbnailFileId = result.thumbnailFileKey;

          const formData = form.getValues();
          const finalBundle = {
            title: formData.title,
            description: formData.description,
            tags: formData.tags,
            categoryId: formData.categoryId, // <-- change to formData.categoryId if you rename the field
            privacyStatus: formData.privacyStatus?.toLowerCase(), // <-- change to formData.privacyStatus if you rename the field
            license: formData.license,
            embeddable: formData.embeddable,
            publicStatsViewable: formData.publicStatsViewable,
            selfDeclaredMadeForKids: formData.selfDeclaredMadeForKids,
            containsSyntheticMedia: formData.containsSyntheticMedia,
            recordingDate: formData.recordingDate, // ISO string
            videoUrl: videoFileId, // <-- Use the returned video file ID
            thumbnailUrl: thumbnailFileId, // <-- Use the returned thumbnail file ID
            submittedFor: formData.submittedFor,
          };
          // console.log('Final Submission Bundle:', finalBundle);

          // Send the final bundle to your API
          const response = await axios.post(`/content/submit`, finalBundle, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `${localStorage.getItem('token')}`,
            },
          });

          // console.log('Response of conten submit', response);

          if (response.status !== 200) {
            setUploadError('Upload failed. Please try again.');
            toast.error('Server responded with error.', { id: 'uploadToast' });
            setPendingSubmit(false);
            setUploading(false);
            return;
          }

          toast.success('Video uploaded successfully!', { id: 'uploadToast' });

          // Reset form and clear video/thumbnail after successful upload
          form.reset();
          setVideo(null); // <-- Only reset after success
          setThumbnail(null);
          setInput('');
          // setDateTimeISO("");

          // Reset the file input fields visually
          if (videoInputRef.current) videoInputRef.current.value = '';
          if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
          if (response.status === 200) {
            navigate('/manager/dashboard');
          }
        } catch (err) {
          toast.error('Upload failed. Please try again.', {
            id: 'uploadToast',
          });
          if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;
            setUploadError(message || "Unknown Axios error");
          } else {
            setUploadError(err?.message || 'Upload failed. Please try again.');
          }
          // console.error('Upload error:', err);
        }
        setPendingSubmit(false);
        setUploading(false);
      }
    };
    doUpload();
  }, [pendingSubmit]);

  const onSubmit = () => {
    // console.log('Final Submission Bundle:', form.getValues());
    toast.loading('Uploading your video...', { id: 'uploadToast' });
    setPendingSubmit(true);
    setUploading(true);
  };

  return !uploading ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="submittedFor"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CreatorsList
                  selectedCreator={field.value}
                  setSelectedCreator={field.onChange}
                  label={
                    <FormLabel htmlFor="creator" className="flex items-center gap-2 ">
                      <>
                        {field.error}
                        <span>Select Creator :</span>
                        <span
                          className={`text-xs ${form.formState.errors.submittedFor ? 'text-destructive' : 'text-muted-foreground'}`}
                        >
                          Select the creator and upload a video to assign it under their name.
                        </span>
                      </>
                    </FormLabel>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title Input (Similar to YouTube Studio) */}
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
                      placeholder="Enter video title"
                      {...field}
                      rows={1}
                      className={`pb-6 resize-none overflow-hidden ${isLimitExceeded ? 'border-destructive' : ''}`}
                      onInput={autoResize}
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

        {/* Description Input (YouTube Studio Style) */}
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
                      placeholder="Tell viewers about your video"
                      {...field}
                      rows={4}
                      className={`pb-6 resize-none overflow-hidden ${isLimitExceeded ? 'border-destructive' : ''}`}
                      onInput={autoResize}
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

        <div className="space-y-6 w-full mx-auto">
          <Upload
            video={video}
            thumbnail={thumbnail}
            onSelectVideo={handleVideoSelect}
            onSelectThumbnail={handleThumbnailSelect}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 w-full">
            <FormField
              control={form.control}
              name="video"
              render={() => (
                <FormItem>
                  <input
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                    ref={videoInputRef}
                    onChange={e => {
                      const file = e.target.files[0];
                      handleVideoSelect(file);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={() => (
                <FormItem>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={thumbnailInputRef}
                    onChange={e => {
                      const file = e.target.files[0];
                      handleThumbnailSelect(file);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 w-full">
          {/* Tag Input */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => {
              const charCount = tags.reduce((sum, tag) => sum + tag.length, 0) || 0;
              const isLimitExceeded = charCount > 500;

              return (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
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
                    {tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-accent text-sm px-2 py-1 rounded flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          className="cursor-pointer text-red-500"
                          onClick={() => removeTag(index)}
                          aria-label={`Remove tag ${tag}`}
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

          <FormField
            control={form.control}
            name="recordingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start space-x-0 space-y-1.5  lg:w-[100%] md:w-[100%] w-full xl:w-[100%]">
                <FormControl>
                  <DateTimePicker
                    // value={field.value}
                    label="Recording Date & Time"
                    value={field.value} // <-- Ensure DateTimePicker is controlled by form state
                    onChange={iso => {
                      field.onChange(iso); // Update form state with ISO date
                    }}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      {name === 'embeddable' && 'Allow others to embed your video in their sites.'}
                      {name === 'publicStatsViewable' && 'Allow viewers to see like/view counts.'}
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
        {uploadError && (
          <div className="bg-destructive text-destructive-foreground p-2 rounded-md mt-6 flex justify-center">
            <p>{uploadError}</p>
          </div>
        )}
        <div className="sticky bottom-0 bg-background py-4 border-t mt-10 flex justify-center mt-16 mb-8 w-full">
          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </div>
      </form>
    </Form>
  ) : (
    <div className="flex flex-col items-center gap-2">
      <UploadMedia
        videoFile={video}
        thumbnailFile={thumbnail}
        ref={uploadRef}
        creatorId={form.getValues().submittedFor}
      />
    </div>
  );
}
