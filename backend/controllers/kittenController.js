import Kitten from "../models/Kitten.js";

function parseJsonField(val, fallback) {
  if (val === undefined || val === null || val === "") return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function parseStringArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      // single URL string
      return [val].filter(Boolean);
    }
  }
  return [];
}

// 🌍 PUBLIC / ADMIN: GET ALL KITTENS (FILTER + SEARCH + PAGINATION)
export const getKittens = async (req, res) => {
  try {
    const {
      breed,
      gender,
      status,
      minPrice,
      maxPrice,
      search,
      includeAll,
      page = 1,
      limit = 50,
    } = req.query;

    let filter = {};

    if (breed) filter.breed = breed;
    if (gender) filter.gender = gender;
    if (status) {
      filter.status = status;
    } else if (includeAll !== "true") {
      // Public visitors see Available, Reserved, and Adopted kittens (not Draft or Unavailable)
      filter.status = { $nin: ["Draft", "Unavailable"] };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { breed: { $regex: search, $options: "i" } },
        { coat: { $regex: search, $options: "i" } },
      ];
    }

    const kittens = await Kitten.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Kitten.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      kittens,
    });
  } catch (error) {
    console.error("🔥 GET KITTENS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch kittens" });
  }
};

// 🌍 PUBLIC: GET SINGLE KITTEN
export const getKittenById = async (req, res) => {
  try {
    const kitten = await Kitten.findById(req.params.id);

    if (!kitten) {
      return res.status(404).json({ error: "Kitten not found" });
    }

    res.json(kitten);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch kitten" });
  }
};

// 👑 ADMIN: CREATE KITTEN (Supports up to 10 photos via files and/or pre-uploaded AI imageUrls)
export const createKitten = async (req, res) => {
  try {
    const uploadedUrls = Array.isArray(req.files)
      ? req.files.map((file) => file.path).filter(Boolean)
      : [];

    const existingUrls = [
      ...parseStringArray(req.body.existingImages),
      ...parseStringArray(req.body.imageUrls),
    ];

    let allImages = [...existingUrls, ...uploadedUrls];
    // Deduplicate while preserving order
    allImages = Array.from(new Set(allImages));

    if (allImages.length === 0) {
      return res
        .status(400)
        .json({ error: "At least 1 image is required" });
    }

    if (allImages.length > 10) {
      return res.status(400).json({
        error: "Maximum 10 photographs allowed per kitten listing",
      });
    }

    // Handle primary image ordering
    const requestedPrimary = req.body.primaryImage;
    if (requestedPrimary && allImages.includes(requestedPrimary)) {
      allImages = [
        requestedPrimary,
        ...allImages.filter((u) => u !== requestedPrimary),
      ];
    }

    const specsObj = parseJsonField(req.body.specs, {
      coatType: req.body.coatType || "",
      eyeColor: req.body.eyeColor || "",
      weight: req.body.weight || "",
      hypoallergenic: req.body.hypoallergenic || "Low-Shedding Standard",
      legType: req.body.legType || "",
      pattern: req.body.pattern || "",
    });

    const medicalObj = parseJsonField(req.body.medical, {
      vaccinated:
        req.body.vaccinated !== undefined
          ? req.body.vaccinated === "true" || req.body.vaccinated === true
          : true,
      dewormed:
        req.body.dewormed !== undefined
          ? req.body.dewormed === "true" || req.body.dewormed === true
          : true,
      healthGuarantee:
        req.body.healthGuarantee || "1-Year Genetic Guarantee",
      vetChecked:
        req.body.vetChecked !== undefined
          ? req.body.vetChecked === "true" || req.body.vetChecked === true
          : true,
      microchipped:
        req.body.microchipped !== undefined
          ? req.body.microchipped === "true" || req.body.microchipped === true
          : true,
      vetNotes: req.body.vetNotes || "",
    });

    const lineageObj = parseJsonField(req.body.lineage, {
      sire: req.body.sire || "",
      dam: req.body.dam || "",
      registry: req.body.registry || "",
    });

    const aiMetadataObj = parseJsonField(req.body.aiMetadata, undefined);
    if (aiMetadataObj && aiMetadataObj.generatedByAi) {
      aiMetadataObj.adminApprovedAt = new Date();
    }

    const imageMetadata = allImages.map((url, index) => ({
      url,
      isPrimary: index === 0,
      order: index,
      caption: `${req.body.name || "Kitten"} — Photo #${index + 1}`,
    }));

    const kitten = await Kitten.create({
      name: req.body.name,
      ...(req.body.registryId && String(req.body.registryId).trim()
        ? { registryId: String(req.body.registryId).trim() }
        : {}),
      breed: req.body.breed,
      gender: req.body.gender || "Female",
      ageWeeks: Number(req.body.ageWeeks) || 10,
      dob: req.body.dob || "",
      coat: req.body.coat,
      status: req.body.status || "Available",
      price: Number(req.body.price) || 1800,
      Shipping:
        req.body.Shipping !== undefined ? Number(req.body.Shipping) : 0,
      trait: req.body.trait || "",
      shortDescription: req.body.shortDescription || "",
      description: req.body.description,
      primaryImage: allImages[0],
      images: allImages,
      imageMetadata,
      specs: specsObj,
      medical: medicalObj,
      lineage: lineageObj,
      seoTitle: req.body.seoTitle || "",
      seoDescription: req.body.seoDescription || "",
      ...(aiMetadataObj ? { aiMetadata: aiMetadataObj } : {}),
    });

    res.status(201).json(kitten);
  } catch (error) {
    console.error("🔥 CREATE KITTEN ERROR:", error);

    // 🛡️ Automatic Recovery: If a duplicate key error occurs on legacy registryId_1, retry with a fresh unique registryId
    if (
      error.code === 11000 &&
      (error.keyPattern?.registryId || String(error.message).includes("registryId"))
    ) {
      try {
        const freshRegId = `MK-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const retryKitten = await Kitten.create({
          name: req.body.name,
          registryId: freshRegId,
          breed: req.body.breed,
          gender: req.body.gender || "Female",
          ageWeeks: Number(req.body.ageWeeks) || 10,
          dob: req.body.dob || "",
          coat: req.body.coat,
          status: req.body.status || "Available",
          price: Number(req.body.price) || 1800,
          Shipping: req.body.Shipping !== undefined ? Number(req.body.Shipping) : 0,
          trait: req.body.trait || "",
          shortDescription: req.body.shortDescription || "",
          description: req.body.description,
          primaryImage: req.body.primaryImage || (req.files?.[0]?.path) || "",
          images: Array.isArray(req.files) ? req.files.map((f) => f.path) : [],
          seoTitle: req.body.seoTitle || "",
          seoDescription: req.body.seoDescription || "",
        });
        return res.status(201).json(retryKitten);
      } catch (retryErr) {
        console.error("Retry kitten creation failed:", retryErr);
      }
    }

    res.status(500).json({
      error: error.message || "Failed to create kitten",
    });
  }
};

// 👑 ADMIN: UPDATE KITTEN (Preserves & reorders existing images + adds new uploads up to 10)
export const updateKitten = async (req, res) => {
  try {
    const kitten = await Kitten.findById(req.params.id);

    if (!kitten) {
      return res.status(404).json({ error: "Kitten not found" });
    }

    const uploadedUrls = Array.isArray(req.files)
      ? req.files.map((file) => file.path).filter(Boolean)
      : [];

    let retainedImages = kitten.images || [];
    if (req.body.existingImages !== undefined) {
      retainedImages = parseStringArray(req.body.existingImages);
    }

    let combinedImages =
      uploadedUrls.length > 0 || req.body.existingImages !== undefined
        ? Array.from(new Set([...retainedImages, ...uploadedUrls]))
        : kitten.images;

    if (combinedImages.length === 0) {
      return res.status(400).json({
        error: "At least 1 photograph must remain on the kitten listing",
      });
    }

    if (combinedImages.length > 10) {
      return res.status(400).json({
        error: "Maximum 10 photographs allowed per kitten listing",
      });
    }

    if (
      req.body.primaryImage &&
      combinedImages.includes(req.body.primaryImage)
    ) {
      combinedImages = [
        req.body.primaryImage,
        ...combinedImages.filter((u) => u !== req.body.primaryImage),
      ];
    }

    kitten.images = combinedImages;
    kitten.primaryImage = combinedImages[0];
    kitten.imageMetadata = combinedImages.map((url, idx) => ({
      url,
      isPrimary: idx === 0,
      order: idx,
      caption: `${req.body.name || kitten.name} — Photo #${idx + 1}`,
    }));

    const scalarFields = [
      "name",
      "registryId",
      "breed",
      "gender",
      "dob",
      "coat",
      "status",
      "trait",
      "shortDescription",
      "description",
      "seoTitle",
      "seoDescription",
    ];

    scalarFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        kitten[field] = req.body[field];
      }
    });

    if (req.body.ageWeeks !== undefined) {
      kitten.ageWeeks = Number(req.body.ageWeeks);
    }
    if (req.body.price !== undefined) {
      kitten.price = Number(req.body.price);
    }
    if (req.body.Shipping !== undefined) {
      kitten.Shipping = Number(req.body.Shipping);
    }

    if (req.body.specs) {
      const parsedSpecs = parseJsonField(req.body.specs, null);
      if (parsedSpecs) {
        kitten.specs = { ...(kitten.specs?.toObject?.() || kitten.specs || {}), ...parsedSpecs };
      }
    }

    if (req.body.medical) {
      const parsedMedical = parseJsonField(req.body.medical, null);
      if (parsedMedical) {
        kitten.medical = {
          ...(kitten.medical?.toObject?.() || kitten.medical || {}),
          ...parsedMedical,
        };
      }
    }

    if (req.body.lineage) {
      const parsedLineage = parseJsonField(req.body.lineage, null);
      if (parsedLineage) {
        kitten.lineage = {
          ...(kitten.lineage?.toObject?.() || kitten.lineage || {}),
          ...parsedLineage,
        };
      }
    }

    const updated = await kitten.save();
    res.json(updated);
  } catch (error) {
    console.error("🔥 UPDATE KITTEN ERROR:", error);
    res.status(500).json({
      error: error.message || "Failed to update kitten",
    });
  }
};

// 👑 ADMIN: DELETE KITTEN
export const deleteKitten = async (req, res) => {
  try {
    const kitten = await Kitten.findByIdAndDelete(req.params.id);

    if (!kitten) {
      return res.status(404).json({ error: "Kitten not found" });
    }

    res.json({ message: "Kitten deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete kitten" });
  }
};
