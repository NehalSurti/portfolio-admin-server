import WorkExperience from "../models/Experience.js";
import { workExperienceSchema } from "../validators/experienceValidation.js";
import { z } from "zod";

// @desc    Create a new work experience
// @route   POST /api/experiences
export const createExperience = async (req, res) => {
  try {
    // Validate request body
    const validatedData = workExperienceSchema.parse(req.body);

    // Create experience
    const experience = await WorkExperience.create(validatedData);

    res.status(201).json({
      success: true,
      data: experience,
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

// @desc    Get all work experiences
// @route   GET /api/experiences
export const getExperiences = async (req, res) => {
  try {
    const experiences = await WorkExperience.find().sort({ startDate: -1 });
    res.status(200).json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get a single experience by ID
// @route   GET /api/experiences/:id
export const getExperienceById = async (req, res) => {
  try {
    const experience = await WorkExperience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update a work experience by ID
// @route   PUT /api/experiences/:id
export const updateExperience = async (req, res) => {
  try {
    const validatedData = workExperienceSchema.parse(req.body);

    const experience = await WorkExperience.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      data: experience,
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

// @desc    Delete a work experience by ID
// @route   DELETE /api/experiences/:id
export const deleteExperience = async (req, res) => {
  try {
    const experience = await WorkExperience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
