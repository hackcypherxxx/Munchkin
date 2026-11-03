// routes/settingsRoutes.js
import express from "express";
import {
  getSettings,
  updateLocation,
  updateSettings,
} from "../controllers/settingsController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 🌍 Public - get global settings (location, phoneNumber, etc.)
router.get("/", getSettings);

// 🔐 Admin - update sanctuary settings
router.put("/", protect, updateSettings);

export default router;