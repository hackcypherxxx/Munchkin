import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  approveApplication,
  rejectApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 🌍 Public
router.post("/", createApplication);

// 👑 Admin
router.get("/", protect, getApplications);
router.get("/:id", protect, getApplicationById);
router.put("/:id/status", protect, updateApplicationStatus);
router.put("/:id/approve", protect, approveApplication);
router.put("/:id/reject", protect, rejectApplication);
router.delete("/:id", protect, deleteApplication);

export default router;
