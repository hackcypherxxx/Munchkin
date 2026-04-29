    import express from "express";
    import { sendAdminMessage } from "../controllers/adminContactController.js";
    import protect from "../middleware/authMiddleware.js";

    const router = express.Router();

    // 👑 admin only
    router.post("/send", protect, sendAdminMessage);

    export default router;