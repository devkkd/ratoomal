import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SubCategory from "@/models/SubCategory";

// GET ALL (with category)
export async function GET() {
  await connectDB();

  const subcategories = await SubCategory.find()
    .populate("category", "name")
    .sort({ createdAt: -1 });

  return NextResponse.json({
    success: true,
    data: subcategories,
  });
}

// CREATE
export async function POST(request) {
  await connectDB();

  const body = await request.json();
  const subcategory = await SubCategory.create(body);

  return NextResponse.json({
    success: true,
    data: subcategory,
  });
}
