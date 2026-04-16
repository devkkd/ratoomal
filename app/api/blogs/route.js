import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit")) || 12;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    let query = { status: "published" };

    if (category && category !== "all") query.category = category;
    if (featured === "true") query.featured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-content") // exclude heavy content from listing
      .lean();

    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch blogs", detail: error.message }, { status: 500 });
  }
}
