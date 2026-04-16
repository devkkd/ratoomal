import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = await params;

    // Support lookup by both _id and slug
    let blog = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findOne({ _id: id, status: "published" }).lean();
    } else {
      blog = await Blog.findOne({ slug: id, status: "published" }).lean();
    }

    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    // Increment views (fire and forget)
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();

    // Fetch related blogs (same category, exclude current)
    const related = await Blog.find({
      status: "published",
      category: blog.category,
      _id: { $ne: blog._id },
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select("-content")
      .lean();

    return NextResponse.json({ success: true, data: blog, related });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch blog" }, { status: 500 });
  }
}
