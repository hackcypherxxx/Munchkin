import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // 👤 Applicant Info
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    // 🐾 What they want
    applicationType: {
      type: String,
      enum: ["kitten", "retired", "upcoming"],
      required: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "applicationTypeModel",
    },

    applicationTypeModel: {
      type: String,
      enum: ["Kitten", "RetiredKitten", "Upcoming"],
    },

    // 🏡 Screening
    homeDescription: {
      type: String,
      required: true,
    },

    hasPets: Boolean,
    experience: String,

    // 👑 Admin control
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);