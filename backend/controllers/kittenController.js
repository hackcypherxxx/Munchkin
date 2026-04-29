import Kitten from "../models/Kitten.js";
import Settings from "../models/Settings.js";

// 🔧 helper to attach global location
const attachLocation = async (data) => {
  const settings = await Settings.findOne();
  const location = settings?.mainLocation || "Unknown Location";

  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item._doc,
      location,
    }));
  }

  return {
    ...data._doc,
    location,
  };
};

// 🐱 CREATE KITTEN (ADMIN)
export const createKitten = async (req, res) => {
  try {
    const imageUrls = req.files?.map(file => file.path) || [];

    // --- CRITICAL FIX: Parse JSON Strings from FormData ---
    const bodyData = { ...req.body };
    
    if (typeof bodyData.specs === 'string') bodyData.specs = JSON.parse(bodyData.specs);
    if (typeof bodyData.medical === 'string') bodyData.medical = JSON.parse(bodyData.medical);
    if (typeof bodyData.lineage === 'string') bodyData.lineage = JSON.parse(bodyData.lineage);

    const kitten = await Kitten.create({
      ...bodyData,
      images: imageUrls,
    });

    const result = await attachLocation(kitten);

    res.status(201).json({
      success: true,
      kitten: result,
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to create kitten" });
  }
};

// 📦 GET ALL KITTENS (PUBLIC)
export const getKittens = async (req, res) => {
  try {
    const {
      status,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    const kittens = await Kitten.find(query)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Kitten.countDocuments(query);

    const result = await attachLocation(kittens);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      kittens: result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch kittens" });
  }
};

// 🔍 GET SINGLE KITTEN
export const getKittenById = async (req, res) => {
  try {
    const kitten = await Kitten.findById(req.params.id);

    if (!kitten) {
      return res.status(404).json({ error: "Kitten not found" });
    }

    const result = await attachLocation(kitten);

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch kitten" });
  }
};

// ✏️ UPDATE KITTEN (ADMIN)
export const updateKitten = async (req, res) => {
  try {
    const kitten = await Kitten.findById(req.params.id);

    if (!kitten) {
      return res.status(404).json({ error: "Kitten not found" });
    }

    const updateData = { ...req.body };

    // --- CRITICAL FIX: Parse JSON Strings during Update ---
    if (typeof updateData.specs === 'string') updateData.specs = JSON.parse(updateData.specs);
    if (typeof updateData.medical === 'string') updateData.medical = JSON.parse(updateData.medical);
    if (typeof updateData.lineage === 'string') updateData.lineage = JSON.parse(updateData.lineage);

    // update images if new ones uploaded
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path);
      kitten.images = imageUrls;
    }

    // update other fields
    Object.assign(kitten, updateData);

    await kitten.save();

    const result = await attachLocation(kitten);

    res.json({
      success: true,
      kitten: result,
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to update kitten" });
  }
};

// ❌ DELETE KITTEN (ADMIN)
export const deleteKitten = async (req, res) => {
  try {
    const kitten = await Kitten.findById(req.params.id);

    if (!kitten) {
      return res.status(404).json({ error: "Kitten not found" });
    }

    await kitten.deleteOne();

    res.json({
      success: true,
      message: "Kitten deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete kitten" });
  }
};