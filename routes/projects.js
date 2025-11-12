import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleFeatured,
  reorderProjects,
  rebalanceAll,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route: GET /api/projects?featured=true
router.get("/", protect, getProjects);

// Route: GET /api/projects/:id
router.get("/:id", protect, getProjectById);

// Route: POST /api/projects
router.post("/", protect, createProject);

// Route: PUT /api/projects/:id
router.put("/:id", protect, updateProject);

// Route: DELETE /api/projects/:id
router.delete("/:id", protect, deleteProject);

// Route: PUT /api/projects/:id/toggle-featured
router.put("/:id/toggle-featured", protect, toggleFeatured);

// Route: PUT /api/projects/reorder
router.put("/reorder", protect, reorderProjects);

// Route: POST /api/projects/rebalance
router.post("/rebalance", protect, rebalanceAll);

export default router;
