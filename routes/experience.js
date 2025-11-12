import express from "express";
import {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route: GET /api/experiences
router.get("/", protect, getExperiences);

// Route: GET /api/experiences/:id
router.get("/:id", protect, getExperienceById);

// Route: POST /api/experiences
router.post("/", protect, createExperience);

// Route: PUT /api/experiences/:id
router.put("/:id", protect, updateExperience);

// Route: DELETE /api/experiences/:id
router.delete("/:id", protect, deleteExperience);

export default router;
