import { z } from "zod";
import validator from "validator";

// Utility for consistent string sanitization
const sanitizeString = (val) => validator.escape(val.trim());

// Utility for safely normalizing emails (validator can return false)
const normalizeEmail = (val) => {
  const normalized = validator.normalizeEmail(val);
  return normalized ?? val.trim().toLowerCase();
};

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name too long")
    .transform(sanitizeString),

  email: z
    .string({ required_error: "Email is required" })
    .refine((val) => validator.isEmail(val), {
      message: "Invalid email format",
    })
    .transform(normalizeEmail),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(128, "Password too long")
    .transform(sanitizeString),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .refine((val) => validator.isEmail(val), {
      message: "Invalid email format",
    })
    .transform(normalizeEmail),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .transform(sanitizeString),
});
