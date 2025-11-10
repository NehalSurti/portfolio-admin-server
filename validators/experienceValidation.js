import { z } from "zod";
import validator from "validator";

// Reusable string sanitizer
const sanitizeString = (val) => validator.escape(val.trim());

export const workExperienceSchema = z.object({
  jobTitle: z
    .string({ required_error: "Job title is required" })
    .min(1, "Job title is required")
    .max(150, "Job title cannot exceed 150 characters")
    .transform(sanitizeString),

  companyName: z
    .string({ required_error: "Company name is required" })
    .min(1, "Company name is required")
    .max(150, "Company name cannot exceed 150 characters")
    .transform(sanitizeString),

  startDate: z
    .string({ required_error: "Start date is required" })
    .min(1, "Start date is required")
    .transform(sanitizeString),

  endDate: z.string().optional().default("Present").transform(sanitizeString),

  isCurrent: z.boolean().default(false),

  description: z
    .array(
      z
        .string({ required_error: "Description cannot be empty" })
        .min(1, "Description cannot be empty")
        .transform(sanitizeString)
    )
    .min(1, "Job description must contain at least one bullet point"),
});
