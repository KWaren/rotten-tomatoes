// /validators/auth.js
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(8).max(128),
  name: z.string().optional(),
  surname: z.string().optional(),
  profession: z.string().optional(),
  birthday: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
