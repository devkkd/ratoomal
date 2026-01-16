// import mongoose from "mongoose";

// const ProductSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   moq: Number,

//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//   },

//   subCategory: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "SubCategory",
//   },

//   thumbnail: {
//     type: String,
//     required: true,
//   },

//   images: {
//     type: [String],
//     default: [],
//   },

//   services: [String],
//   features: [String],

// }, { timestamps: true });

// export default mongoose.models.Product ||
//   mongoose.model("Product", ProductSchema);

// // models/Product.js
// import mongoose from "mongoose";

// const ProductSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   moq: {
//     type: Number,
//     default: 1
//   },

//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//   },

//   subCategory: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "SubCategory",
//   },

//   thumbnail: {
//     type: String,
//     required: true,
//   },

//   images: {
//     type: [String],
//     default: [],
//   },

//   // ✅ Video field added
//   video360: {
//     type: String,
//     default: ""
//   },

//   services: [String],
//   features: [String],

//   // Additional product specifications
//   godName: String,
//   color: String,
//   suitableFor: String,
//   usage: String,
//   posture: String,
//   baseShape: String,
//   finish: String,
//   appearance: String,
//   careInstruction: String,
//   assemblyRequired: String,
//   availability: {
//     type: String,
//     default: "In Stock"
//   },
//   productType: String,
//   shortDescription: String,
//   longDescription: String,
//   description: String

// }, { timestamps: true });

// export default mongoose.models.Product ||
//   mongoose.model("Product", ProductSchema);

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
