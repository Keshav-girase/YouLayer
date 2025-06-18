import { Languages } from 'lucide-react';
import { z } from 'zod';

const isFile = file => file instanceof File;
const fileRequired = message => file => !!file || message;
const fileSizeMax = (maxSize, message) => file => file.size <= maxSize || message;
const fileExtensionValid = (regex, message) => file => regex.test(file.name) || message;

const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024; // 10MB

export const uploadFormSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(100, 'Title must be at most 100 characters')
      .regex(/^[^<>]*$/, "Title cannot contain '<' or '>'"),

    description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),

    video: z
      .instanceof(File, {
        message: 'Please Select the Video file. it is required',
      })
      .refine(file => file.size > 0, 'Please Select the Video file. it is required')
      .refine(file => file.size <= MAX_VIDEO_SIZE, 'Video file must be at most 2GB')
      .refine(
        file => /\.(mp4|mov|avi|mkv)$/i.test(file.name),
        'Video must be MP4, MOV, AVI, or MKV'
      ),

    thumbnail: z
      .instanceof(File, {
        message: 'Please Select the Thumbnail file, it is required',
      })
      .refine(file => file.size <= MAX_THUMBNAIL_SIZE, 'Thumbnail must be at most 10MB')
      .refine(
        file => /\.(jpg|jpeg|png|gif)$/i.test(file.name),
        'Thumbnail must be JPG, JPEG, PNG, or GIF'
      ),

    tags: z
      .array(z.string().min(1, 'Each tag must be at least 1 character'))
      .optional()
      .refine(arr => !arr || arr.join(',').length <= 500, {
        message: 'Total length of tags must not exceed 500 characters',
      }),

    categoryId: z
      .string()
      .min(1, 'Category ID is required')
      .regex(/^\d+$/, 'Category ID must be numeric'),

    privacyStatus: z.enum(['private', 'public', 'unlisted']),

    language: z
      .string()
      .min(1, 'Language is required')
      .max(50, 'Language must be at most 50 characters')
      .regex(/^[a-zA-Z\-]+$/, 'Language can only contain letters and hyhens'),

    license: z.enum(['creativeCommon', 'youtube']).default('youtube'),

    embeddable: z.boolean().default(true),

    publicStatsViewable: z.boolean().default(true),

    selfDeclaredMadeForKids: z.boolean().default(false),

    containsSyntheticMedia: z.boolean().default(false),

    recordingDate: z.string().datetime({ offset: true }).optional(),

    submittedFor: z.string().nonempty('Please select a creator to proceed'),
  })
  .strict();
