import { z } from 'zod';

export const reviewVideoFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters')
    .regex(/^[^<>]*$/, "Title cannot contain '<' or '>'"),

  description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),

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
    .regex(/^[a-zA-Z\-]+$/, 'Language can only contain letters and hyphens'),

  license: z.enum(['creativeCommon', 'youtube']).default('youtube'),

  embeddable: z.boolean().default(true),

  publicStatsViewable: z.boolean().default(true),

  selfDeclaredMadeForKids: z.boolean().default(false),

  containsSyntheticMedia: z.boolean().default(false),

  recordingDate: z.string().datetime({ offset: true }).optional(),
});