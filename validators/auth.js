import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ required_error: "First name is required." })
    .trim()
    .min(2, "First name must be at least 2 characters long.")
    .max(50, "First name must not exceed 50 characters."),

  surname: z
    .string({ required_error: "Last name is required." })
    .trim()
    .min(2, "Last name must be at least 2 characters long.")
    .max(50, "Last name must not exceed 50 characters."),

  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .email("Please enter a valid email address."),

  password: z
    .string({ required_error: "Password is required." })
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password must not exceed 128 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),

  profession: z
    .string()
    .trim()
    .min(2, "Profession must be at least 2 characters long.")
    .max(100, "Profession must not exceed 100 characters.")
    .optional(),

  birthday: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Birthday must be in the format YYYY-MM-DD.")
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
