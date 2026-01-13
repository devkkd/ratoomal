import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";

// GET SINGLE
export async function GET(request, context) {
  await connectDB();

  const { id } = context.params; // ✅ same flow

  const inquiry = await Inquiry
    .findById(id)
    .populate("product");

  return NextResponse.json({
    success: true,
    data: inquiry,
  });
}

// UPDATE
export async function PATCH(request, context) {
  await connectDB();

  const { id } = context.params;
  const body = await request.json();

  const updated = await Inquiry.findByIdAndUpdate(id, body, {
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

  const { id } = context.params;

  await Inquiry.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    message: "Inquiry deleted",
  });
}
    