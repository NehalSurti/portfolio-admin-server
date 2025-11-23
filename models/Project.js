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

    // Featured Project (for homepage)
    featured: {
      type: Boolean,
      default: false,
    },

    // Display Order (for manual or auto ordering)
    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

/* =====================================================
   🔹 AUTO-ASSIGN DISPLAY ORDER ON CREATE / FEATURE TOGGLE
   ===================================================== */
ProjectSchema.pre("save", async function (next) {
  if (this.isModified("featured") || this.isNew) {
    const Project = mongoose.model("Project");

    // Determine which group to compare (featured or not)
    const filter = { featured: this.featured };
    const maxOrderDoc = await Project.findOne(filter)
      .sort("-displayOrder")
      .select("displayOrder")
      .lean();

    // Assign next available order number
    this.displayOrder = maxOrderDoc ? maxOrderDoc.displayOrder + 1 : 1;
  }

  next();
});

/* =====================================================
   🔹 AUTO-REBALANCE ORDER AFTER DELETE
   ===================================================== */
ProjectSchema.post("findOneAndDelete", async function (deletedDoc) {
  if (!deletedDoc) return;

  const Project = mongoose.model("Project");
  const groupFilter = { featured: deletedDoc.featured };

  const remainingProjects = await Project.find(groupFilter)
    .sort({ displayOrder: 1 })
    .select("_id displayOrder");

  for (let i = 0; i < remainingProjects.length; i++) {
    await Project.findByIdAndUpdate(remainingProjects[i]._id, {
      displayOrder: i + 1,
    });
  }
});

/* =====================================================
   🔹 STATIC HELPERS
   ===================================================== */
ProjectSchema.statics.findFeatured = function () {
  return this.find({ featured: true, status: "published" }).sort({
    displayOrder: 1,
  });
};

ProjectSchema.statics.findRegular = function () {
  return this.find({ featured: false, status: "published" }).sort({
    displayOrder: 1,
  });
};

/* =====================================================
   🔹 MANUAL REBALANCE HELPER (ADMIN DASHBOARD USE)
   ===================================================== */
ProjectSchema.statics.rebalance = async function (isFeatured) {
  const projects = await this.find({ featured: isFeatured })
    .sort({ displayOrder: 1 })
    .select("_id");

  for (let i = 0; i < projects.length; i++) {
    await this.findByIdAndUpdate(projects[i]._id, { displayOrder: i + 1 });
  }

  return true;
};

/* =====================================================
   🔹 REORDER BY IDS (for drag-and-drop admin dashboards)
   ===================================================== */
/**
 * Reorder projects manually by passing an array of IDs.
 * Example: await Project.reorderByIds(["id3", "id1", "id2"], true);
 * Automatically updates displayOrder in given sequence.
 */
ProjectSchema.statics.reorderByIds = async function (ids, isFeatured) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("ids must be a non-empty array of project IDs");
  }

  const session = await this.startSession();
  session.startTransaction();

  try {
    // Ensure the IDs belong to the same featured group
    const projects = await this.find({
      _id: { $in: ids },
      featured: isFeatured,
    }).select("_id");

    if (projects.length !== ids.length) {
      throw new Error(
        "Some provided project IDs are invalid or belong to a different group"
      );
    }

    // Update displayOrder sequentially based on array order
    for (let i = 0; i < ids.length; i++) {
      await this.findByIdAndUpdate(
        ids[i],
        { displayOrder: i + 1 },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Display order successfully updated." };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export default mongoose.model("Project", ProjectSchema);
