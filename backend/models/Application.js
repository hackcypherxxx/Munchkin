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

    // 💳 Payment method – now includes "other"
    paymentMethod: {
      type: String,
      required: [true, "Please choose a payment method"],
      enum: {
        values: ["apple pay", "cash app", "zelle", "chime", "giftcard", "other"],
        message: "{VALUE} is not a valid payment method",
      },
      lowercase: true,
    },

    // ✍️ Custom payment method name (only used if paymentMethod = "other")
    paymentMethodOther: {
      type: String,
      trim: true,
      maxlength: [50, "Custom method name must be under 50 characters"],
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

// 🛡️ Custom validation: if paymentMethod is "other", then paymentMethodOther must be provided
applicationSchema.pre("validate", function (next) {
  if (this.paymentMethod === "other" && !this.paymentMethodOther) {
    this.invalidate("paymentMethodOther", "Please describe your payment method");
  }
  next();
});

export default mongoose.model("Application", applicationSchema);