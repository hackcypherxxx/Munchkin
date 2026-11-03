import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    enquiryReference: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    name: {
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
      default: "",
      trim: true,
    },

    inquiryType: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["New", "In Progress", "Replied", "Archived"],
      default: "New",
    },

    adminNotes: {
      type: String,
      default: "",
    },

    repliedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

export default mongoose.model("Contact", contactSchema);
