import { z } from 'zod';

export const scoreInputSchema = z.object({
  score: z
    .number({ invalid_type_error: 'Score must be a number' })
    .int('Score must be an integer')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score cannot exceed 45'),
  scoreDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const charitySelectionSchema = z.object({
  charityId: z.string().uuid('Invalid charity selection'),
  contributionPercentage: z
    .number()
    .int()
    .min(10, 'Minimum contribution is 10%')
    .max(100, 'Maximum contribution is 100%'),
});

export const drawConfigSchema = z.object({
  engineType: z.enum(['random', 'algorithmic']),
  drawDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const proofUploadSchema = z.object({
  winnerId: z.string().uuid(),
});
