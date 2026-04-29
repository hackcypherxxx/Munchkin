// routes/settingsRoutes.js
import express from "express";
import {
  getSettings,
  updateLocation,
} from "../controllers/settingsController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 🌍 Public - get global settings (location, etc.)
router.get("/", getSettings);

// 🔐 Admin - update location
router.put("/", protect, updateLocation);

export default router;