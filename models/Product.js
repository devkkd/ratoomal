import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    moq: {
      type: Number,
      default: 1,
      min: 1,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    video360: {
      type: String,
      default: "",
    },

    services: {
      type: [String],
      default: [],
    },

    features: {
      type: [String],
      default: [],
    },

    godName: String,
    color: String,
    suitableFor: String,
    usage: String,
    posture: String,
    baseShape: String,
    finish: String,
    material: String, // New field for material filter
    size: String, // New field for size filter
    appearance: String,
    careInstruction: String,
    assemblyRequired: String,

    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },

    productType: String,
    shortDescription: String,
    longDescription: String,
    description: String,
  },
  { timestamps: true }
);

/* ✅ SAFE MIDDLEWARE (NO next(), NO ERROR) */
ProductSchema.pre("save", function () {
  if (this.video360 && this.video360.startsWith("data:")) {
    this.video360 = "";
  }

  if (Array.isArray(this.images)) {
    this.images = this.images.filter(
      (img) => typeof img === "string" && img.trim() !== ""
    );
  }
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
