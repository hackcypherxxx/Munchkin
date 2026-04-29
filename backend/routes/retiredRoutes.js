import express from "express";
import {
  createRetired,
  getRetired,
  getRetiredById,
  updateRetired,
  deleteRetired,
} from "../controllers/retiredController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../utils/cloudinaryStorage.js";

const router = express.Router();

// 🌍 public
router.get("/", getRetired);
router.get("/:id", getRetiredById);

// 👑 admin
router.post("/", protect, upload.single("image"), createRetired);
router.put("/:id", protect, upload.single("image"), updateRetired);
router.delete("/:id", protect, deleteRetired);

export default router;