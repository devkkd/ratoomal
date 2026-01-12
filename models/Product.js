import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  moq: Number,

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

  services: [String],
  features: [String],

}, { timestamps: true });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
