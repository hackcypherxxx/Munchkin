import express from "express";
import multer from "multer";
import {
  getKittens,
  getKittenById,
  createKitten,
  updateKitten,
  deleteKitten,
} from "../controllers/kittenController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../utils/cloudinaryStorage.js";

const router = express.Router();

// Multer wrapper enforcing maximum 10 photographs per kitten listing
const uploadMax10Images = (req, res, next) => {
  const handler = upload.array("images", 10);
  handler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (
        err.code === "LIMIT_UNEXPECTED_FILE" ||
        err.code === "LIMIT_FILE_COUNT"
      ) {
        return res.status(400).json({
          error: "Maximum 10 photographs allowed per kitten listing",
        });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({
        error: err.message || "Failed to upload photographs",
      });
    }
    next();
  });
};

// 🌍 Public (supports ?includeAll=true for Admin Dashboard)
router.get("/", getKittens);
router.get("/:id", getKittenById);

// 👑 Admin Only (supports up to 10 uploaded photos + pre-uploaded URLs)
router.post("/", protect, uploadMax10Images, createKitten);
router.put("/:id", protect, uploadMax10Images, updateKitten);
router.delete("/:id", protect, deleteKitten);

export default router;
