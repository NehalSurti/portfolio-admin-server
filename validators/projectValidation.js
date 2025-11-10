import { z } from "zod";
import validator from "validator";

// Reusable URL validation
const isValidUrl = (url) =>
  !url || validator.isURL(url, { require_protocol: true });

// Reusable sanitizers
const sanitizeString = (val) => validator.escape(val.trim());

export const projectSchema = z.object({
  title: z
    .string({ required_error: "Project title is required" })
    .min(1, "Project title is required")
    .max(100, "Title cannot exceed 100 characters")
    .transform(sanitizeString),

  description: z
    .string({ required_error: "Project description is required" })
    .min(1, "Project description is required")
    .transform(sanitizeString),

  image: z
    .string({ required_error: "Image URL is required" })
    .refine(isValidUrl, { message: "Invalid image URL" })
    .transform((val) => val.trim()),

  technologies: z
    .array(z.string().min(1, "Technology cannot be empty"), {
      required_error: "At least one technology is required",
    })
    .min(1, "Technologies array cannot be empty"),

  githubUrl: z
    .string({ required_error: "GitHub Repository URL is required" })
    .refine(isValidUrl, { message: "Invalid GitHub URL" })
    .transform((val) => val.trim()),

  url: z
    .string({ required_error: "Live Project URL is required" })
    .refine(isValidUrl, { message: "Invalid project URL" })
    .transform((val) => val.trim()),

  status: z
    .enum(["draft", "published"], {
      required_error: "Project status is required",
    })
    .default("draft")
    .transform(sanitizeString),
});
