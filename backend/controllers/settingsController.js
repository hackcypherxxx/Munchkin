// controllers/settingsController.js
import Settings from "../models/Settings.js";

// GET settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

// UPDATE location & settings (admin only)
export const updateLocation = async (req, res) => {
  try {
    const {
      mainLocation,
      phoneNumber,
      contactEmail,
      adminTestEmail,
      autoSendStatusEmails,
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    if (mainLocation !== undefined) {
      settings.mainLocation = String(mainLocation).trim();
    }
    if (phoneNumber !== undefined) {
      settings.phoneNumber = String(phoneNumber).trim();
    }
    if (contactEmail !== undefined) {
      settings.contactEmail = String(contactEmail).trim().toLowerCase();
    }
    if (adminTestEmail !== undefined) {
      settings.adminTestEmail = String(adminTestEmail).trim();
    }
    if (typeof autoSendStatusEmails === "boolean") {
      settings.autoSendStatusEmails = autoSendStatusEmails;
    }

    await settings.save();

    res.json(settings);
  } catch (error) {
    console.error("🔥 UPDATE SETTINGS ERROR:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
};

export const updateSettings = updateLocation;