import express from "express";
import {
  createNotification,
  getNotifications,
  getAllNotificationsAdmin,
  updateNotification,
  deleteNotification,
} from "../controllers/notificationController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../utils/cloudinaryStorage.js";

const router = express.Router();

// 🌍 public
router.get("/", getNotifications);

// 👑 admin
router.get("/admin", protect, getAllNotificationsAdmin);
router.post("/", protect, upload.single("image"), createNotification);
router.put("/:id", protect, upload.single("image"), updateNotification);
router.delete("/:id", protect, deleteNotification);

export default router;