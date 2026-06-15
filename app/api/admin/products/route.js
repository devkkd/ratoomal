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

    // 🔴 REQUIRED FIELD CHECK — price and moq are optional
    if (!body.name || !body.code || !body.thumbnail || !body.category) {
      return NextResponse.json(
        { success: false, message: "Required fields missing (name, code, thumbnail, category)" },
        { status: 400 }
      );
    }

    // 🧼 CLEAN DATA (schema-safe)
    const cleanBody = {
      name: body.name,
      code: body.code?.toUpperCase(),
      price: body.price !== undefined && body.price !== "" ? Number(body.price) : 0,
      moq: body.moq !== undefined && body.moq !== "" ? Number(body.moq) : 1,
      category: body.category,
      thumbnail: body.thumbnail,

      images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
      services: Array.isArray(body.services) ? body.services : [],
      features: Array.isArray(body.features) ? body.features : [],
      sizes: (() => {
        if (!body.sizes) return [];
        if (typeof body.sizes === 'string') {
          return body.sizes.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
        if (Array.isArray(body.sizes)) {
          return body.sizes.flat().map(s => String(s).trim()).filter(s => s.length > 0);
        }
        return [];
      })(),
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
