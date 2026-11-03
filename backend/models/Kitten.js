import mongoose from "mongoose";

const imageMetaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    caption: { type: String, default: "" },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    qualityNote: { type: String, default: "" },
  },
  { _id: false }
);

const kittenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    registryId: {
      type: String,
      trim: true,
    },

    breed: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Unknown"],
      required: true,
    },

    ageWeeks: {
      type: Number,
      required: true,
      min: 0,
    },

    dob: {
      type: String,
      default: "",
      trim: true,
    },

    coat: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Available", "Reserved", "Adopted", "Unavailable"],
      default: "Available",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    Shipping: {
      type: Number,
      default: 0,
    },

    trait: {
      type: String,
      default: "",
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    primaryImage: {
      type: String,
      default: "",
    },

    // 📸 Maximum 10 images per kitten listing
    images: {
      type: [String],
      required: true,
      validate: [
        {
          validator: function (arr) {
            return Array.isArray(arr) && arr.length >= 1;
          },
          message: "At least 1 image is required",
        },
        {
          validator: function (arr) {
            return Array.isArray(arr) && arr.length <= 10;
          },
          message: "Maximum 10 photographs allowed per kitten listing",
        },
      ],
    },

    imageMetadata: {
      type: [imageMetaSchema],
      default: [],
    },

    // 🧬 Physical Specifications
    specs: {
      coatType: { type: String, default: "" },
      eyeColor: { type: String, default: "" },
      weight: { type: String, default: "" },
      hypoallergenic: { type: String, default: "Low-Shedding Standard" },
      legType: { type: String, default: "" },
      pattern: { type: String, default: "" },
    },

    // 🏥 Medical & Health Guarantee
    medical: {
      vaccinated: { type: Boolean, default: true },
      dewormed: { type: Boolean, default: true },
      healthGuarantee: { type: String, default: "1-Year Genetic Guarantee" },
      vetChecked: { type: Boolean, default: true },
      microchipped: { type: Boolean, default: true },
      vetNotes: { type: String, default: "" },
    },

    // 👑 Lineage (Parents)
    lineage: {
      sire: { type: String, default: "" },
      dam: { type: String, default: "" },
      registry: { type: String, default: "" },
    },

    // 🔍 SEO Metadata
    seoTitle: {
      type: String,
      default: "",
      trim: true,
    },

    seoDescription: {
      type: String,
      default: "",
      trim: true,
    },

    // 🤖 AI Provenance & Human-in-the-Loop Audit Metadata
    aiMetadata: {
      generatedByAi: { type: Boolean, default: false },
      modelUsed: { type: String, default: "" },
      fallbackUsed: { type: Boolean, default: false },
      generatedAt: { type: Date },
      adminApprovedAt: { type: Date },
      rawAdminDescription: { type: String, default: "" },
      fieldSources: { type: mongoose.Schema.Types.Mixed, default: {} },
      requiresConfirmation: { type: [String], default: [] },
      visualObservations: { type: mongoose.Schema.Types.Mixed, default: {} },
      imageRecommendations: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
  },
  { timestamps: true }
);

kittenSchema.pre("validate", function () {
  if (!this.registryId || typeof this.registryId !== "string" || !this.registryId.trim()) {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const year = new Date().getFullYear();
    this.registryId = `MK-${year}-${randomPart}`;
  }
});

kittenSchema.index({ registryId: 1 }, { unique: true, sparse: true });
kittenSchema.index({ status: 1, createdAt: -1 });
kittenSchema.index({ breed: 1, gender: 1 });

export default mongoose.model("Kitten", kittenSchema);
