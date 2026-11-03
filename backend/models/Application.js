import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    applicationReference: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

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
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    // 💳 Payment Method
    paymentMethod: {
      type: String,
      enum: [
        "chime",
        "zelle",
        "apple pay",
        "apple_pay",
        "paypal",
        "cash app",
        "cashapp",
        "venmo",
        "bank_transfer",
        "bitcoin",
        "giftcard",
        "gift_card",
        "other",
      ],
      required: true,
    },

    paymentMethodOther: {
      type: String,
      default: "",
      trim: true,
    },

    // 🎯 Application Target Type
    applicationType: {
      type: String,
      enum: ["kitten", "retired", "upcoming"],
      required: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "applicationTypeModel",
      default: null,
    },

    applicationTypeModel: {
      type: String,
      enum: ["Kitten", "RetiredKitten", "Upcoming"],
    },

    kittenSnapshot: {
      name: { type: String, default: "" },
      breed: { type: String, default: "" },
      price: { type: Number, default: 0 },
      image: { type: String, default: "" },
    },

    // 🏡 Living & Experience Details
    homeDescription: {
      type: String,
      required: true,
    },

    hasPets: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "New",
        "Pending",
        "Under Review",
        "More Information Required",
        "Approved",
        "Rejected",
        "Completed",
      ],
      default: "Pending",
    },

    adminNotes: {
      type: String,
      default: "",
    },

    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

applicationSchema.index({ email: 1, createdAt: -1 });
applicationSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Application", applicationSchema);
