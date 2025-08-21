import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z.string().trim().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(2, { message: "Password must be at least 12 characters" })
    .max(64, { message: "Password must be at most 64 characters" }),
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, { message: 'Password must meet complexity requirements' }),
});

export const loginUserSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const updateUserSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email().optional(),
  })
  .partial();

export type LoginUserDto = z.infer<typeof loginUserSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
