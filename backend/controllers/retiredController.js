import RetiredKitten from "../models/RetiredKitten.js";


// ➕ CREATE
export const createRetired = async (req, res) => {
  try {
    const { name, age, status, description, highlights, adoptionFee } = req.body;

    if (!name || !age || !adoptionFee) {
      return res.status(400).json({ error: "Name, age, and adoption fee required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const image = req.file.path;

    const parsedHighlights = highlights
      ? Array.isArray(highlights)
        ? highlights
        : JSON.parse(highlights)
      : [];

    const retired = await RetiredKitten.create({
      name,
      age,
      status,
      adoptionFee,
      description,
      highlights: parsedHighlights,
      image,
    });

    res.status(201).json(retired);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create retired cat" });
  }
};


// 🌍 GET ALL
export const getRetired = async (req, res) => {
  try {
    const data = await RetiredKitten.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch retired cats" });
  }
};


// 🔍 GET ONE
export const getRetiredById = async (req, res) => {
  try {
    const item = await RetiredKitten.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(item);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
};


// ✏️ UPDATE
export const updateRetired = async (req, res) => {
  try {
    const item = await RetiredKitten.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Not found" });
    }

    const { name, age, status, description, highlights, adoptionFee } = req.body;

    if (name) item.name = name;
    if (age) item.age = age;
    if (status) item.status = status;
    if (description) item.description = description;
    if (adoptionFee) item.adoptionFee = adoptionFee;

    if (highlights) {
      item.highlights = Array.isArray(highlights)
        ? highlights
        : JSON.parse(highlights);
    }

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
export const deleteRetired = async (req, res) => {
  try {
    const item = await RetiredKitten.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
};