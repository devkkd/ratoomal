import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params; // ✅ MUST await

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();

    // If code is being updated, make it uppercase
    if (body.code) {
      body.code = body.code.toUpperCase();
    }

    // Guard: ensure sizes is always an array of strings split only by comma
    if (body.sizes !== undefined) {
      if (typeof body.sizes === 'string') {
        body.sizes = body.sizes
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
      } else if (Array.isArray(body.sizes)) {
        // Already array — flatten any accidentally nested arrays, keep as strings
        body.sizes = body.sizes
          .flat()
          .map(s => String(s).trim())
          .filter(s => s.length > 0);
      }
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
