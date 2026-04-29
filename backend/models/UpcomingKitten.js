import mongoose from "mongoose";

const upcomingKittenSchema = new mongoose.Schema(
  {
    title: {
      type: String, // e.g. "Mochi x Oliver"
      required: true,
      trim: true,
    },

    expectedArrival: {
      type: String, // "Early June 2026"
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    features: [
      {
        type: String, // e.g. "Standard Munchkins", "Blue Eyes"
      },
    ],

    image: {
      type: String, // Cloudinary URL
      required: true,
    },
  },
  { timestamps: true }
);

const UpcomingKitten = mongoose.model("UpcomingKitten", upcomingKittenSchema);

export default UpcomingKitten;