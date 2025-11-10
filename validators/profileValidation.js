import { z } from "zod";
import validator from "validator";

// Utility Sanitizers
const sanitizeString = (val) => validator.escape(val.trim());
const isValidUrl = (url) =>
  !url || validator.isURL(url, { require_protocol: true });

// Education Sub-Schema
export const educationSchema = z.object({
  degree: z
    .string({ required_error: "Degree is required" })
    .min(1, "Degree is required")
    .max(100, "Degree name cannot exceed 100 characters")
    .transform(sanitizeString),

  institution: z
    .string({ required_error: "Institution name is required" })
    .min(1, "Institution name is required")
    .max(150, "Institution name cannot exceed 150 characters")
    .transform(sanitizeString),

  graduationYear: z
    .string({ required_error: "Graduation year is required" })
    .min(4, "Graduation year must be valid")
    .max(9, "Graduation year must be valid")
    .transform(sanitizeString),
});

// Certification Sub-Schema
export const certificationSchema = z.object({
  certificateName: z
    .string({ required_error: "Certificate name is required" })
    .min(1, "Certificate name is required")
    .max(150, "Certificate name cannot exceed 150 characters")
    .transform(sanitizeString),

  issuingOrganization: z
    .string({ required_error: "Issuing organization is required" })
    .min(1, "Issuing organization is required")
    .max(150, "Issuing organization cannot exceed 150 characters")
    .transform(sanitizeString),

  yearIssued: z
    .string({ required_error: "Year issued is required" })
    .min(4, "Year issued must be valid")
    .max(9, "Year issued must be valid")
    .transform(sanitizeString),
});

// Main Profile Schema
export const profileSchema = z.object({
  profilePictureUrl: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine(isValidUrl, { message: "Invalid profile picture URL" }),

  headline: z
    .string({ required_error: "Headline is required" })
    .min(1, "Headline is required")
    .max(150, "Headline cannot exceed 150 characters")
    .transform(sanitizeString),

  biography: z
    .string({ required_error: "Biography is required" })
    .min(1, "Biography is required")
    .transform(sanitizeString),

  skills: z
    .array(
      z.string().min(1, "Skill cannot be empty").transform(sanitizeString),
      { required_error: "At least one skill is required" }
    )
    .min(1, "At least one skill is required"),

  education: z.array(educationSchema).default([]),

  certifications: z.array(certificationSchema).default([]),
});
