import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    mainLocation: {
      type: String,
      default: "Beverly Hills & Concierge Cattery, CA",
      trim: true,
    },

    phoneNumber: {
      type: String,
      default: "+1 (607) 223-4177",
      trim: true,
    },

    adminTestEmail: {
      type: String,
      default: "info@munchkinkittie.com",
      trim: true,
    },

    autoSendStatusEmails: {
      type: Boolean,
      default: true,
    },

    aiConfig: {
      mode: {
        type: String,
        enum: [
          "free_only",
          "specific_free_model",
          "paid_enabled",
        ],
        default: "free_only",
      },
      primaryModel: {
        type: String,
        default: "gemini-3.8-flash",
      },
      fallbackModels: {
        type: [String],
        default: [
          "gemini-3.8-flash",
          "gemini-3.6-flash",
          "gemini-3.5-flash-lite",
          "gemini-2.5-flash",
          "gemini-2.5-flash-lite",
          "gemini-2.0-flash",
        ],
      },
      paidModelEnabled: {
        type: Boolean,
        default: false,
      },
      paidModelName: {
        type: String,
        default: "gemini-4-argon",
      },
      timeoutMs: {
        type: Number,
        default: 22000,
      },
      maxRetriesPerModel: {
        type: Number,
        default: 1,
      },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
