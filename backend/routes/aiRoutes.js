import express from "express";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";
import upload from "../utils/cloudinaryStorage.js";
import {
  generateAiKittenListing,
  getAiStatus,
  updateAiConfig,
} from "../controllers/aiController.js";

const router = express.Router();

// Multer wrapper enforcing max 10 photos with clear error response
const uploadMax10Images = (req, res, next) => {
  const handler = upload.array("images", 10);
  handler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE" || err.code === "LIMIT_FILE_COUNT") {
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

router.get("/health", protect, getAiStatus);
router.put("/config", protect, updateAiConfig);
router.post("/generate-listing", protect, uploadMax10Images, generateAiKittenListing);

export default router;

