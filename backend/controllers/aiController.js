import Settings from "../models/Settings.js";
import {
  generateKittenListingWithFallback,
  getAiHealthAndConfig,
} from "../services/geminiService.js";

// 🤖 POST /api/ai/generate-listing (Admin Only)
// Analyzes up to 10 uploaded photos + natural-language description and returns a structured draft for human review.
// NEVER publishes or writes to the Kitten collection automatically.
export const generateAiKittenListing = async (req, res) => {
  try {
    const adminDescription =
      req.body.description || req.body.adminDescription || "";

    let existingImageUrls = [];
    if (req.body.imageUrls) {
      if (Array.isArray(req.body.imageUrls)) {
        existingImageUrls = req.body.imageUrls;
      } else if (typeof req.body.imageUrls === "string") {
        try {
          const parsed = JSON.parse(req.body.imageUrls);
          existingImageUrls = Array.isArray(parsed) ? parsed : [req.body.imageUrls];
        } catch {
          existingImageUrls = [req.body.imageUrls];
        }
      }
    }

    const uploadedUrls = Array.isArray(req.files)
      ? req.files.map((f) => f.path).filter(Boolean)
      : [];

    const allImageUrls = [...existingImageUrls, ...uploadedUrls];

    if (allImageUrls.length > 10) {
      return res.status(400).json({
        error: "Maximum 10 photographs allowed per kitten listing",
      });
    }

    if (!adminDescription.trim() && allImageUrls.length === 0) {
      return res.status(400).json({
        error:
          "Please upload at least one photograph or provide a natural-language description for the AI Listing Assistant.",
      });
    }

    let knownDetails = {};
    if (req.body.knownDetails) {
      try {
        knownDetails =
          typeof req.body.knownDetails === "string"
            ? JSON.parse(req.body.knownDetails)
            : req.body.knownDetails;
      } catch {
        knownDetails = {};
      }
    }

    const simulatePrimaryFailure =
      req.body.simulatePrimaryFailure === true ||
      req.body.simulatePrimaryFailure === "true";
    const simulateAllModelsFailure =
      req.body.simulateAllModelsFailure === true ||
      req.body.simulateAllModelsFailure === "true";

    const result = await generateKittenListingWithFallback({
      adminDescription,
      imageUrls: allImageUrls,
      knownDetails,
      simulatePrimaryFailure,
      simulateAllModelsFailure,
    });

    if (result.allModelsFailed) {
      return res.status(503).json({
        error: result.error,
        allModelsFailed: true,
        uploadedImageUrls: allImageUrls,
        preservedDescription: adminDescription,
        preservedDraft: result.preservedDraft,
        telemetry: result.telemetry,
      });
    }

    res.json({
      message:
        "AI listing draft generated. Please review and confirm all fields before saving as Draft or Publishing.",
      uploadedImageUrls: allImageUrls,
      listing: result.listing,
      telemetry: result.telemetry,
    });
  } catch (error) {
    console.error("🔥 AI LISTING GENERATION ERROR:", error);
    res.status(500).json({
      error: "Failed to generate AI kitten listing draft",
      details: error.message,
    });
  }
};

// 📊 GET /api/ai/health (Admin Only)
export const getAiStatus = async (req, res) => {
  try {
    const data = await getAiHealthAndConfig();
    res.json(data);
  } catch (error) {
    console.error("🔥 AI HEALTH ERROR:", error);
    res.status(500).json({ error: "Failed to fetch AI configuration & health" });
  }
};

// ⚙️ PUT /api/ai/config (Admin Only)
export const updateAiConfig = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    const {
      mode,
      primaryModel,
      fallbackModels,
      paidModelEnabled,
      paidModelName,
      timeoutMs,
      adminTestEmail,
      autoSendStatusEmails,
    } = req.body;

    if (!settings.aiConfig) {
      settings.aiConfig = {};
    }

    if (mode) settings.aiConfig.mode = mode;
    if (primaryModel) settings.aiConfig.primaryModel = primaryModel;
    if (Array.isArray(fallbackModels) && fallbackModels.length > 0) {
      settings.aiConfig.fallbackModels = fallbackModels;
    }
    if (typeof paidModelEnabled === "boolean") {
      settings.aiConfig.paidModelEnabled = paidModelEnabled;
    }
    if (paidModelName) settings.aiConfig.paidModelName = paidModelName;
    if (timeoutMs) settings.aiConfig.timeoutMs = Number(timeoutMs);
    if (adminTestEmail !== undefined) settings.adminTestEmail = adminTestEmail;
    if (typeof autoSendStatusEmails === "boolean") {
      settings.autoSendStatusEmails = autoSendStatusEmails;
    }

    await settings.save();
    const updatedHealth = await getAiHealthAndConfig();
    res.json({
      message: "AI & System Configuration updated",
      ...updatedHealth,
    });
  } catch (error) {
    console.error("🔥 UPDATE AI CONFIG ERROR:", error);
    res.status(500).json({ error: "Failed to update AI configuration" });
  }
};

