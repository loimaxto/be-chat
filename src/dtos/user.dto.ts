// src/schemas/userSchemas.ts
import { z } from 'zod';

// Define the Zod schema for creating a user
export const createUserSchema = z.object({
    username: z.string()
        .trim()
        .min(3, { message: 'Username must be at least 3 characters' })
        .max(20, { message: 'Username must be at most 20 characters' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
    email: z.string()
        .trim()
        .email({ message: 'Invalid email format' }),
    password: z.string()
        .min(2, { message: 'Password must be at least 12 characters' })
        .max(64, { message: 'Password must be at most 64 characters' })
        // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, { message: 'Password must meet complexity requirements' }),
});

// Infer the TypeScript type from the Zod schema
export type CreateUserDto = z.infer<typeof createUserSchema>;

// You can define other schemas like update user, login, etc.
export const updateUserSchema = z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
}).partial(); // Makes all fields optional
