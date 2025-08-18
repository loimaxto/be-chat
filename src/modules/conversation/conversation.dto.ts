import { z } from 'zod';

export const createConversationSchema = z.object({
  name: z.string().min(1, 'Conversation name cannot be empty').optional(),
  isGroup: z.boolean().default(false),
  participants: z.array(z.string()).min(1, 'At least one participant is required'),
});

export type CreateConversationDto = z.infer<typeof createConversationSchema>;
