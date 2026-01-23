import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { adminAuth } from "../middleware/adminAuth";

/* =======================
   GET ALL PRODUCTS
======================= */
export async function GET() {
  // Check admin authentication
  const authResult = await adminAuth();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    await connectDB();

    const products = await Product.find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* =======================
   CREATE PRODUCT
======================= */
export async function POST(request) {
  // Check admin authentication
  const authResult = await adminAuth();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    await connectDB();
    const body = await request.json();

    // 🔴 REQUIRED FIELD CHECK (schema based)
    if (!body.name || !body.price || !body.thumbnail || !body.category) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    // 🧼 CLEAN DATA (schema-safe)
    const cleanBody = {
      name: body.name,
      price: Number(body.price),
      moq: Number(body.moq) || 1,
      category: body.category,
      thumbnail: body.thumbnail,

      images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
      services: Array.isArray(body.services) ? body.services : [],
      features: Array.isArray(body.features) ? body.features : [],
      video360: body.video360 || "",

      availability: body.availability || "In Stock",
      productType: body.productType || "",
      shortDescription: body.shortDescription || "",
      longDescription: body.longDescription || "",
      description: body.description || "",

      godName: body.godName || "",
      color: body.color || "",
      suitableFor: body.suitableFor || "",
      usage: body.usage || "",
      posture: body.posture || "",
      baseShape: body.baseShape || "",
      finish: body.finish || "",
      appearance: body.appearance || "",
      careInstruction: body.careInstruction || "",
      assemblyRequired: body.assemblyRequired || "",
    };

    // ❗ Optional subCategory
    if (body.subCategory) {
      cleanBody.subCategory = body.subCategory;
    }

    const product = await Product.create(cleanBody);

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
