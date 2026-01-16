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

// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  moq: {
    type: Number,
    default: 1
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },

  thumbnail: {
    type: String,
    required: true,
  },

  images: {
    type: [String],
    default: [],
  },

  // ✅ Video field added
  video360: {
    type: String,
    default: ""
  },

  services: [String],
  features: [String],

  // Additional product specifications
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
    default: "In Stock"
  },
  productType: String,
  shortDescription: String,
  longDescription: String,
  description: String

}, { timestamps: true });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);