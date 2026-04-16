import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    author: {
      name: { type: String, default: "Ratoomal's Team" },
      avatar: { type: String, default: "" },
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Craftsmanship",
        "Culture & Heritage",
        "Decor Tips",
        "Behind the Scenes",
        "Exhibitions",
        "News & Updates",
        "Spiritual",
      ],
      default: "News & Updates",
    },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    readTime: { type: Number, default: 5 },
    publishedAt: { type: Date, default: null },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
