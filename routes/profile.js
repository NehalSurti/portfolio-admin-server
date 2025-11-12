import express from "express";
import {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route: GET /api/profiles
router.get("/", protect, getProfiles);

// Route: GET /api/profiles/:id
router.get("/:id", protect, getProfileById);

// Route: POST /api/profiles
router.post("/", protect, createProfile);

// Route: PUT /api/profiles/:id
router.put("/:id", protect, updateProfile);

// Route: DELETE /api/profiles/:id
router.delete("/:id", protect, deleteProfile);

export default router;
