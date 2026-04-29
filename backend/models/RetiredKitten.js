import mongoose from "mongoose";

const retiredKittenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "Adopted"],
      default: "Available",
    },

    adoptionFee: {
      type: Number, // 🔥 NEW
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    highlights: [
      {
        type: String,
      },
    ],

    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RetiredKitten", retiredKittenSchema);