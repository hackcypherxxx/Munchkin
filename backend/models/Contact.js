import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    inquiryType: {
      type: String,
      required: true,
    },

    message: {
      type: String, // "Tell us more about your home"
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);