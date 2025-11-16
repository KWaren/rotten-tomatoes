import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password too short" }),
  name: z.string().optional(),
  surname: z.string().optional(),
  profession: z.string().optional(),
  birthday: z.string().optional(),
});
