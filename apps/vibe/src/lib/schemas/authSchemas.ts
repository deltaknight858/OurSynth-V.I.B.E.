import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

export const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export type AuthSchema = z.infer<typeof authSchema>;
export type EmailSchema = z.infer<typeof emailSchema>;
