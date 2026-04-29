import express from "express";
import { loginAdmin } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import Admin from "../models/Admin.js";

const router = express.Router();
 
// 🔐 LOGIN
router.post("/login", loginAdmin);

// 👤 GET CURRENT ADMIN (for token validation)
router.get("/me", protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json(admin);

  } catch (error) {
    console.error("ME ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;