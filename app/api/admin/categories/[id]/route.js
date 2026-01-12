import { NextResponse } from "next/server";
import Category from "@/models/Category";
import connectDB from "@/lib/db";

// GET SINGLE
export async function GET(request, context) {
  await connectDB();

  const { id } = await context.params; // ✅ FIX

  const category = await Category.findById(id);

  return NextResponse.json({
    success: true,
    data: category,
  });
}

// UPDATE
export async function PATCH(request, context) {
  await connectDB();

  const { id } = await context.params; // ✅ FIX
  const body = await request.json();

  const updated = await Category.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json({
    success: true,
    data: updated,
  });
}

// DELETE
export async function DELETE(request, context) {
  await connectDB();

  const { id } = await context.params; // ✅ FIX

  await Category.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    message: "Category deleted",
  });
}
