// models/Kitten.js
import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema({
  event: String,
  status: String,
  week: String,
});

const lineageSchema = new mongoose.Schema({
  relation: String, // Dam / Sire
  name: String,
  title: String,
});

const specSchema = new mongoose.Schema({
  label: String,
  value: String,
});

const kittenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    registryId: {
      type: String,
      unique: true,
      trim: true,
    },

    breed: {
      type: String,
      default: "Munchkin",
    },

    // 🔥 NEW: GENDER (for filtering)
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },

    // 🔥 NEW: AGE (in weeks for logic)
    ageWeeks: {
      type: Number,
    },

    // 🔥 NEW: COAT TYPE
    coat: {
      type: String,
      enum: ["Shorthair", "Longhair", "Standard"],
      default: "Standard",
    },

    status: {
      type: String,
      enum: ["Available", "Reserved", "Adopted"],
      default: "Available",
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // 🔥 NEW: highlight tag (UI badge like "TICA Reg", "Champion Blood")
    trait: {
      type: String,
    },

    specs: [specSchema],
    medical: [medicalSchema],
    lineage: [lineageSchema],

    images: [String],

    // 🔥 NEW: ordering priority (featured kittens first)
    isFeatured: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);

const Kitten = mongoose.model("Kitten", kittenSchema);

export default Kitten;