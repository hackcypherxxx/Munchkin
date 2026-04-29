import express from "express";
import upload from "../utils/cloudinaryStorage.js";
import {
  createReview,
  getReviews,
  getReviewStats,
  getAllReviewsAdmin,
  approveReview,
  deleteReview,
} from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// public
router.post("/", upload.single("image"), createReview); // 🔥 IMPORTANT
router.get("/", getReviews);
router.get("/stats", getReviewStats);

// admin
router.get("/admin", protect, getAllReviewsAdmin);
router.put("/:id/approve", protect, approveReview);
router.delete("/:id", protect, deleteReview);

export default router;