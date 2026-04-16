import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import { adminAuth } from "../middleware/adminAuth";

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET(req) {
  const authResult = await adminAuth();
  if (authResult.error) return authResult.error;

  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== "all") query.status = status;
    if (category && category !== "all") query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const stats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: { $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] } },
          draft: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
          featured: { $sum: { $cond: ["$featured", 1, 0] } },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: { currentPage: page, totalPages, totalItems: total },
      stats: stats[0] || { total: 0, published: 0, draft: 0, featured: 0 },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req) {
  const authResult = await adminAuth();
  if (authResult.error) return authResult.error;

  await connectDB();

  try {
    const body = await req.json();
    const { title, excerpt, content, coverImage, category } = body;

    if (!title || !excerpt || !content || !coverImage || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, excerpt, content, coverImage, category" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existing = await Blog.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    // Set publishedAt if publishing
    const publishedAt = body.status === "published" ? new Date() : null;

    const blog = await Blog.create({ ...body, slug, publishedAt });

    return NextResponse.json(
      { success: true, data: blog, message: "Blog created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create blog" }, { status: 500 });
  }
}
