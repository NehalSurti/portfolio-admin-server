import Project from "../models/Project.js";
import { projectSchema } from "../validators/projectValidation.js";
import { z } from "zod";

// @desc    Create a new project
export const createProject = async (req, res) => {
  try {
    // Validate request body
    const validatedData = projectSchema.parse(req.body);

    // Create project
    const project = await Project.create(validatedData);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update a project by ID
export const updateProject = async (req, res) => {
  try {
    // Validate request body
    const validatedData = projectSchema.parse(req.body);

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete a project by ID
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Get all projects (optionally filter by featured)
 * GET /api/projects?featured=true
 */
export const getProjects = async (req, res) => {
  try {
    const { featured } = req.query;

    let filter = {};
    if (featured !== undefined) {
      filter.featured = featured === "true"; // parse query string to boolean
    }

    const projects = await Project.find(filter).sort({ displayOrder: 1 });

    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Toggle featured flag for a project
 * PUT /api/projects/:id/toggle-featured
 */
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    project.featured = !project.featured;
    await project.save();

    // Rebalance orders for both featured and non-featured groups
    if (typeof Project.rebalance === "function") {
      await Project.rebalance(true);
      await Project.rebalance(false);
    }

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Reorder projects
 * PUT /api/projects/reorder
 * body: { ids: [id1, id2, id3], featured: true/false }
 */
export const reorderProjects = async (req, res) => {
  try {
    const { ids, featured } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "ids array is required" });
    }

    if (typeof featured !== "boolean") {
      return res
        .status(400)
        .json({ success: false, message: "featured must be boolean" });
    }

    if (typeof Project.reorderByIds !== "function") {
      return res
        .status(500)
        .json({ success: false, message: "Reorder function not implemented" });
    }

    const result = await Project.reorderByIds(ids, featured);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Rebalance all project orders manually
 * POST /api/projects/rebalance
 */
export const rebalanceAll = async (req, res) => {
  try {
    if (typeof Project.rebalance !== "function") {
      return res.status(500).json({
        success: false,
        message: "Rebalance function not implemented",
      });
    }

    await Project.rebalance(true); // featured projects
    await Project.rebalance(false); // non-featured projects

    res
      .status(200)
      .json({ success: true, message: "All projects rebalanced successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
