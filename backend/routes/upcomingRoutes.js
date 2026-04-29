import express from "express";
import {
  createUpcoming,
  getUpcoming,
  getUpcomingById,
  updateUpcoming,
  deleteUpcoming,
} from "../controllers/upcomingController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../utils/cloudinaryStorage.js";

const router = express.Router();

// 🌍 public
router.get("/", getUpcoming);
router.get("/:id", getUpcomingById);

// 👑 admin
router.post("/", protect, upload.single("image"), createUpcoming);
router.put("/:id", protect, upload.single("image"), updateUpcoming);
router.delete("/:id", protect, deleteUpcoming);

export default router;