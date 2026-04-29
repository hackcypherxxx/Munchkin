// routes/kittenRoutes.js
import express from "express";

import {
  createKitten,
  getKittens,
  getKittenById,
  updateKitten,
  deleteKitten,
} from "../controllers/kittenController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../utils/cloudinaryStorage.js";

const router = express.Router();


// 📦 PUBLIC ROUTES
router.get("/", getKittens);           // get all kittens
router.get("/:id", getKittenById);     // get single kitten


// 🔐 ADMIN ROUTES
router.post(
  "/",
  protect,
  upload.array("images", 5),
  createKitten
);

router.put(
  "/:id",
  protect,
  upload.array("images", 5),
  updateKitten
);

router.delete(
  "/:id",
  protect,
  deleteKitten
);

export default router;