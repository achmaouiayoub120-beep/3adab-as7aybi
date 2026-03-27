import { z } from 'zod';

export const createReservationSchema = z.object({
  matchId: z.number().int().positive(),
  zone: z.enum(['VIP', 'TRIBUNE', 'POPULAIRE']),
  quantity: z.number().int().min(1).max(10),
  paymentMethod: z.enum(['card', 'cmi', 'paypal']).optional().default('card'),
});
