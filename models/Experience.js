import mongoose from "mongoose";

const WorkExperienceSchema = new mongoose.Schema(
  {
    // Job Title
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [150, "Job title cannot exceed 150 characters"],
    },

    // Company Name
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },

    // Start Date
    startDate: {
      type: String,
      required: [true, "Start date is required"],
      trim: true,
    },

    // End Date (optional, must be after start date if provided)
    endDate: {
      type: String,
      trim: true,
      default: "Present",
    },

    // Flag for current job
    isCurrent: {
      type: Boolean,
      default: false,
    },

    // Job Description as bullet points
    description: {
      type: [String],
      required: [
        true,
        "Job description must include at least one bullet point",
      ],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "Job description must contain at least one bullet point.",
      },
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

export default mongoose.model("WorkExperience", WorkExperienceSchema);
