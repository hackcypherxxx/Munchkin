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

// UPDATE location (admin only)
export const updateLocation = async (req, res) => {
  try {
    const { mainLocation } = req.body;

    if (!mainLocation) {
      return res.status(400).json({ error: "Location is required" });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({ mainLocation });
    } else {
      settings.mainLocation = mainLocation.trim();
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update location" });
  }
};