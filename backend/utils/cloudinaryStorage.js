// utils/cloudinaryStorage.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "kittens",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],

      // 🔥 unique + clean filename
      public_id: `kitten-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

const upload = multer({ storage });

export default upload;