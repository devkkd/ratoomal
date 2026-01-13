import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";

// CREATE INQUIRY
export async function POST(request) {
  await connectDB();

  const body = await request.json();

  const inquiry = await Inquiry.create(body);

  return NextResponse.json({
    success: true,
    data: inquiry,
  });
}

// GET ALL INQUIRIES (Admin)
export async function GET() {
  await connectDB();

  const inquiries = await Inquiry
    .find()
    .populate("product")
    .sort({ createdAt: -1 });

  return NextResponse.json({
    success: true,
    data: inquiries,
  });
}
