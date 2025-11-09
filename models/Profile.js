import mongoose from "mongoose";

// Education Sub-Schema
const EducationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
      maxlength: [100, "Degree name cannot exceed 100 characters"],
    },
    institution: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
      maxlength: [150, "Institution name cannot exceed 150 characters"],
    },
    graduationYear: {
      type: String,
      required: [true, "Graduation year is required"],
    },
  },
  { _id: true }
);

// Certification Sub-Schema
const CertificationSchema = new mongoose.Schema(
  {
    certificateName: {
      type: String,
      required: [true, "Certificate name is required"],
      trim: true,
      maxlength: [150, "Certificate name cannot exceed 150 characters"],
    },
    issuingOrganization: {
      type: String,
      required: [true, "Issuing organization is required"],
      trim: true,
      maxlength: [150, "Issuing organization cannot exceed 150 characters"],
    },
    yearIssued: {
      type: String,
      required: [true, "Year issued is required"],
    },
  },
  { _id: true }
);

// Main Profile Schema
const ProfileSchema = new mongoose.Schema(
  {
    // Profile Picture URL
    profilePictureUrl: {
      type: String,
      trim: true,
      default: null,
    },

    // Headline
    headline: {
      type: String,
      required: [true, "Headline is required"],
      trim: true,
      maxlength: [150, "Headline cannot exceed 150 characters"],
    },

    // Biography
    biography: {
      type: String,
      required: [true, "Biography is required"],
      trim: true,
    },

    // Skills
    skills: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one skill is required",
      },
    },

    // Education
    education: {
      type: [EducationSchema],
      default: [],
    },

    // Certifications
    certifications: {
      type: [CertificationSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export default mongoose.model("Profile", ProfileSchema);
