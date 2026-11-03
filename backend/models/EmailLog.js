import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    recipientName: {
      type: String,
      default: "",
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailTemplate",
      default: null,
    },

    templateSlug: {
      type: String,
      default: "",
      trim: true,
    },

    templateName: {
      type: String,
      default: "Custom Message",
      trim: true,
    },

    relatedType: {
      type: String,
      enum: ["Application", "Contact", "Kitten", "Review", "Manual", "Test"],
      default: "Manual",
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    relatedReference: {
      type: String,
      default: "",
      trim: true,
    },

    provider: {
      type: String,
      default: "Resend",
    },

    providerMessageId: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Queued",
        "Accepted by provider",
        "Delivered",
        "Bounced",
        "Failed",
      ],
      default: "Queued",
    },

    errorMessage: {
      type: String,
      default: "",
    },

    sentBy: {
      type: String,
      default: "System",
    },

    idempotencyKey: {
      type: String,
      default: "",
      index: true,
    },
  },
  { timestamps: true }
);

emailLogSchema.index({ createdAt: -1 });
emailLogSchema.index({ recipientEmail: 1, createdAt: -1 });
emailLogSchema.index({ relatedId: 1 });

export default mongoose.model("EmailLog", emailLogSchema);

