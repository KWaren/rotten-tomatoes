// /validators/auth.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(8).max(128),
  name: z.string().optional(),
  surname: z.string().optional(),
  profession: z.string().optional(),
  birthday: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;
