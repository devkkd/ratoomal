import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SubCategory from "@/models/SubCategory";

// GET SINGLE
export async function GET(request, context) {
  await connectDB();

  const { id } = await context.params;

  const subcategory = await SubCategory.findById(id).populate(
    "category",
    "name"
  );

  return NextResponse.json({
    success: true,
    data: subcategory,
  });
}

// UPDATE
export async function PATCH(request, context) {
  await connectDB();

  const { id } = await context.params;
  const body = await request.json();

  const updated = await SubCategory.findByIdAndUpdate(id, body, {
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

  const { id } = await context.params;

  await SubCategory.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    message: "SubCategory deleted",
  });
}
