import UpcomingKitten from "../models/UpcomingKitten.js";


// ➕ CREATE
export const createUpcoming = async (req, res) => {
  try {
    const { title, expectedArrival, description, features } = req.body;

    if (!title || !expectedArrival) {
      return res.status(400).json({ error: "Title and expected arrival required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const image = req.file.path;

    const parsedFeatures = features
      ? Array.isArray(features)
        ? features
        : JSON.parse(features)
      : [];

    const upcoming = await UpcomingKitten.create({
      title,
      expectedArrival,
      description,
      features: parsedFeatures,
      image,
    });

    res.status(201).json(upcoming);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create upcoming kitten" });
  }
};


// 🌍 GET ALL (PUBLIC)
export const getUpcoming = async (req, res) => {
  try {
    const data = await UpcomingKitten.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch upcoming kittens" });
  }
};


// 🔍 GET ONE
export const getUpcomingById = async (req, res) => {
  try {
    const item = await UpcomingKitten.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(item);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
};


// ✏️ UPDATE
export const updateUpcoming = async (req, res) => {
  try {
    const item = await UpcomingKitten.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Not found" });
    }

    const { title, expectedArrival, description, features } = req.body;

    if (title) item.title = title;
    if (expectedArrival) item.expectedArrival = expectedArrival;
    if (description) item.description = description;

    if (features) {
      item.features = Array.isArray(features)
        ? features
        : JSON.parse(features);
    }

    // 🖼️ update image if new one uploaded
    if (req.file) {
      item.image = req.file.path;
    }

    await item.save();

    res.json(item);

  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
};


// ❌ DELETE
export const deleteUpcoming = async (req, res) => {
  try {
    const item = await UpcomingKitten.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
};