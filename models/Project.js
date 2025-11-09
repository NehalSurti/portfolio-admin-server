import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    // Project Title
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    // Description
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },

    // Single Image URL (Firebase or elsewhere)
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },

    // Technologies Used
    technologies: {
      type: [String],
      required: [true, "At least one technology is required"],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Technologies array cannot be empty",
      },
    },

    // GitHub Repository URL
    githubUrl: {
      type: String,
      required: [true, "GitHub Repository URL is required"],
      trim: true,
    },

    // Live Project URL
    url: {
      type: String,
      required: [true, "Live Project URL is required"],
      trim: true,
    },

    // Project Status (e.g., published, draft)
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

export default mongoose.model("Project", ProjectSchema);
