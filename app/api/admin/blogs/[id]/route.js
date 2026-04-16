import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import { adminAuth } from "../../middleware/adminAuth";

export async function GET(req, { params }) {
  const authResult = await adminAuth();
  if (authResult.error) return authResult.error;

  await connectDB();

  try {
    const { id } = await params;
    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const authResult = await adminAuth();
  if (authResult.error) return authResult.error;

  await connectDB();

  try {
    const { id } = await params;
    const body = await req.json();

    // Set publishedAt if publishing for the first time
    const existing = await Blog.findById(id);
    if (body.status === "published" && existing?.status !== "published" && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const blog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog, message: "Blog updated successfully" });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ success: false, error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const authResult = await adminAuth();
  if (authResult.error) return authResult.error;

  await connectDB();

  try {
    const { id } = await params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ success: false, error: "Failed to delete blog" }, { status: 500 });
  }
}
