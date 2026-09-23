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

export const paymentInputSchema = z.object({
  cardholderName: z.string().min(2, 'Cardholder name is required'),
  cardNumber: z
    .string()
    .min(15, 'Card number must be at least 15 digits')
    .max(19, 'Card number is too long')
    .regex(/^[\d\s-]+$/, 'Card number must only contain digits and spaces'),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry must be in MM/YY format'),
  cvv: z
    .string()
    .min(3, 'CVV must be 3 or 4 digits')
    .max(4, 'CVV cannot exceed 4 digits')
    .regex(/^\d+$/, 'CVV must be numeric'),
  billingEmail: z.string().email('Please enter a valid billing email address'),
});
