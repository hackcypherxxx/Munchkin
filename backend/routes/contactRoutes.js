import express from "express";
import {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 🌍 Public
router.post("/", createContact);

// 👑 Admin
router.get("/", protect, getContacts);
router.put("/:id", protect, updateContact);
router.delete("/:id", protect, deleteContact);

export default router;
