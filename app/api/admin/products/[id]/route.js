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


import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(request, context) {
  await connectDB();
  const { id } = await context.params;

  const product = await Product.findById(id)
    .populate("category")
    .populate("subCategory");

  return NextResponse.json({ success: true, data: product });
}

export async function PATCH(request, context) {
  await connectDB();
  const { id } = await context.params;
  const body = await request.json();

  const updated = await Product.findByIdAndUpdate(id, body, { new: true });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request, context) {
  await connectDB();
  const { id } = await context.params;

  await Product.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    message: "Product deleted successfully",
  });
}