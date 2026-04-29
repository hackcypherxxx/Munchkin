import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 🌍 public
router.post("/", createApplication);

// 👑 admin
router.get("/", protect, getApplications);
router.get("/:id", protect, getApplicationById);
router.put("/:id/approve", protect, approveApplication);
router.put("/:id/reject", protect, rejectApplication);
router.delete("/:id", protect, deleteApplication);

export default router;