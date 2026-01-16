// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import Product from "@/models/Product";

// export async function GET(request, context) {
//   await connectDB();
//   const { id } = await context.params;

//   const product = await Product.findById(id)
//     .populate("category")
//     .populate("subCategory");

//   return NextResponse.json({ success: true, data: product });
// }

// export async function PATCH(request, context) {
//   await connectDB();
//   const { id } = await context.params;
//   const body = await request.json();

//   const updated = await Product.findByIdAndUpdate(id, body, { new: true });

//   return NextResponse.json({ success: true, data: updated });
// }

// export async function DELETE(request, context) {
//   await connectDB();
//   const { id } = await context.params;

//   await Product.findByIdAndDelete(id);

//   return NextResponse.json({
//     success: true,
//     message: "Product deleted",
//   });
// }


// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import Product from "@/models/Product";

// export async function GET(request, context) {
//   await connectDB();
//   const { id } = await context.params;

//   const product = await Product.findById(id)
//     .populate("category")
//     .populate("subCategory");

//   return NextResponse.json({ success: true, data: product });
// }

// export async function PATCH(request, context) {
//   await connectDB();
//   const { id } = await context.params;
//   const body = await request.json();

//   const updated = await Product.findByIdAndUpdate(id, body, { new: true });

//   return NextResponse.json({ success: true, data: updated });
// }

// export async function DELETE(request, context) {
//   await connectDB();
//   const { id } = await context.params;

//   await Product.findByIdAndDelete(id);

//   return NextResponse.json({
//     success: true,
//     message: "Product deleted successfully",
//   });
// }
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

    const updated = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

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
