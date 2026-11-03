import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  restoreDefaultTemplates,
  deleteEmailTemplate,
  previewEmailTemplate,
  sendTrackedTemplateEmail,
  sendAdminTestEmail,
  getEmailLogs,
} from "../controllers/emailController.js";

const router = express.Router();

// All Email Template Library & History endpoints are Admin Protected
router.get("/templates", protect, getEmailTemplates);
router.post("/templates", protect, createEmailTemplate);
router.post("/templates/restore-defaults", protect, restoreDefaultTemplates);
router.put("/templates/:id", protect, updateEmailTemplate);
router.delete("/templates/:id", protect, deleteEmailTemplate);

router.post("/preview", protect, previewEmailTemplate);
router.post("/send", protect, sendTrackedTemplateEmail);
router.post("/test", protect, sendAdminTestEmail);
router.get("/logs", protect, getEmailLogs);

export default router;

