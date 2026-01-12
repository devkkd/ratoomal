import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();

  const products = await Product.find()
    .populate("category", "name")
    .populate("subCategory", "name")
    .sort({ createdAt: -1 });

  return NextResponse.json({ success: true, data: products });
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    console.log("BODY RECEIVED:", body);

    const product = await Product.create(body);

    return NextResponse.json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        error: error.errors || error,
      },
      { status: 500 }
    );
  }
}
