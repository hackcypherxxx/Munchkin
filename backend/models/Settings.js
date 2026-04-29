// models/Settings.js
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    mainLocation: {
      type: String,
      default: "Default Nursery Location",
      trim: true,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;