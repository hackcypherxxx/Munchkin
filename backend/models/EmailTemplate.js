import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Enquiry", "Application", "Reservation", "Follow-Up", "General"],
      default: "General",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    htmlBody: {
      type: String,
      required: true,
    },

    textBody: {
      type: String,
      default: "",
    },

    variables: {
      type: [String],
      default: [
        "customerName",
        "kittenName",
        "applicationReference",
        "applicationDate",
        "applicationStatus",
        "adminName",
        "businessName",
        "contactEmail",
        "contactPhone",
        "reservationReference",
        "nextSteps",
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

emailTemplateSchema.index({ category: 1, isActive: 1 });

export default mongoose.model("EmailTemplate", emailTemplateSchema);

