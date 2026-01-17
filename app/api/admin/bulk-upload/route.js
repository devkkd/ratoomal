// import { NextResponse } from "next/server";
// import { writeFile, unlink, mkdir } from "fs/promises";
// import fs from "fs";
// import { existsSync } from "fs";
// import path from "path";
// import * as XLSX from "xlsx";

// import connectDB from "@/lib/db";
// import Product from "@/models/Product";
// import Category from "@/models/Category";
// import SubCategory from "@/models/SubCategory";
// import cloudinary from "@/lib/cloudinary";

// export const dynamic = "force-dynamic";
// export const maxDuration = 60;

// export async function POST(request) {
//   console.log("📥 Bulk upload API called");

//   let tempFilePath = "";

//   try {
//     await connectDB();

//     const formData = await request.formData();
//     const file = formData.get("file");

//     if (!file) {
//       return NextResponse.json(
//         { success: false, message: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     // Convert file to buffer
//     const buffer = Buffer.from(await file.arrayBuffer());

//     // Temp directory
//     const tempDir = path.join(process.cwd(), "tmp");
//     if (!existsSync(tempDir)) {
//       await mkdir(tempDir, { recursive: true });
//     }

//     tempFilePath = path.join(
//       tempDir,
//       `upload_${Date.now()}_${file.name}`
//     );
//     await writeFile(tempFilePath, buffer);

//     // Read Excel
//     const workbook = XLSX.read(buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const rows = XLSX.utils.sheet_to_json(worksheet);

//     if (!rows.length) {
//       await unlink(tempFilePath);
//       return NextResponse.json(
//         { success: false, message: "Excel file is empty" },
//         { status: 400 }
//       );
//     }

//     const results = [];
//     const errors = [];

//     for (let i = 0; i < rows.length; i++) {
//       const row = rows[i];
//       const rowNumber = i + 2;

//       try {
//         // Basic fields
//         const productName =
//           row.name || row["Product Name"];
//         const productPrice =
//           row.price || row["Price"];
//         const categoryName =
//           row.category || row["Category"];

//         if (!productName || !productPrice || !categoryName) {
//           errors.push(`Row ${rowNumber}: Missing required fields`);
//           continue;
//         }

//         // Category
//         const category = await Category.findOne({
//           name: { $regex: new RegExp(`^${categoryName}$`, "i") },
//         });

//         if (!category) {
//           errors.push(
//             `Row ${rowNumber}: Category "${categoryName}" not found`
//           );
//           continue;
//         }

//         // SubCategory (optional)
//         let subCategory = null;
//         const subCategoryName =
//           row.subCategory || row["Sub Category"];

//         if (subCategoryName) {
//           subCategory = await SubCategory.findOne({
//             name: { $regex: new RegExp(`^${subCategoryName}$`, "i") },
//             category: category._id,
//           });
//         }

//         // =========================
//         // 🔥 CLOUDINARY UPLOADS
//         // =========================

//         // Thumbnail
//         let thumbnail = "";
//         if (row.Thumbnail) {
//           const thumbPath = path.join(
//             process.cwd(),
//             "public",
//             row.Thumbnail
//           );
//           thumbnail = await uploadToCloudinary(
//             thumbPath,
//             "products/thumbnails",
//             "image"
//           );
//         }

//         // Multiple Images
//         let images = [];
//         if (row.Images) {
//           const imageList = String(row.Images)
//             .split(",")
//             .map((i) => i.trim());

//           for (const img of imageList) {
//             const imgPath = path.join(
//               process.cwd(),
//               "public",
//               img
//             );
//             const url = await uploadToCloudinary(
//               imgPath,
//               "products/images",
//               "image"
//             );
//             if (url) images.push(url);
//           }
//         }

//         // 360 Video
//         let video360 = "";
//         if (row.Video360) {
//           const videoPath = path.join(
//             process.cwd(),
//             "public",
//             row.Video360
//           );
//           video360 = await uploadToCloudinary(
//             videoPath,
//             "products/videos",
//             "video"
//           );
//         }

//         // Product data
//         const productData = {
//           name: String(productName).trim(),
//           price: Number(productPrice),
//           moq: Number(row.MOQ || 1),
//           category: category._id,
//           subCategory: subCategory?._id || null,

//           thumbnail,
//           images,
//           video360,

//           services: parseArray(row.Services),
//           features: parseArray(row.Features),

//           availability:
//             row.Availability === "Out of Stock"
//               ? "Out of Stock"
//               : "In Stock",

//           shortDescription: row["Short Description"] || "",
//           description: row.Description || "",
//         };

//         const product = await Product.create(productData);

//         results.push({
//           row: rowNumber,
//           productId: product._id,
//           name: product.name,
//         });

//         console.log(`✅ Product created: ${product.name}`);
//       } catch (err) {
//         console.error(err);
//         errors.push(`Row ${rowNumber}: ${err.message}`);
//       }
//     }

//     if (existsSync(tempFilePath)) {
//       await unlink(tempFilePath);
//     }

//     return NextResponse.json({
//       success: true,
//       summary: {
//         total: rows.length,
//         success: results.length,
//         failed: errors.length,
//       },
//       created: results,
//       errors,
//     });
//   } catch (error) {
//     console.error("❌ Bulk upload error:", error);

//     if (existsSync(tempFilePath)) {
//       await unlink(tempFilePath);
//     }

//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // =========================
// // 🔹 Cloudinary Helper
// // =========================
// async function uploadToCloudinary(filePath, folder, resourceType) {
//   if (!filePath || !existsSync(filePath)) return "";

//   const buffer = fs.readFileSync(filePath);

//   return new Promise((resolve) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder, resource_type: resourceType },
//       (err, result) => {
//         if (err) {
//           console.error("Cloudinary error:", err);
//           resolve("");
//         } else {
//           resolve(result.secure_url);
//         }
//       }
//     );
//     stream.end(buffer);
//   });
// }

// // =========================
// // 🔹 Helpers
// // =========================
// function parseArray(value) {
//   if (!value) return [];
//   return String(value)
//     .split(",")
//     .map((v) => v.trim())
//     .filter(Boolean);
// }

// export async function GET() {
//   return NextResponse.json({
//     success: true,
//     message: "Bulk upload API running",
//   });
// }


import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

export async function POST(req) {
  await connectDB();

  const formData = await req.formData();
  const file = formData.get("file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const success = [];
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNo = i + 2;

    try {
      const category = await Category.findOne({
        name: new RegExp(`^${row.Category}$`, "i"),
      });
      if (!category) throw new Error("Category not found");

      let subCategory = null;
      if (row["Sub Category"]) {
        subCategory = await SubCategory.findOne({
          name: new RegExp(`^${row["Sub Category"]}$`, "i"),
          category: category._id,
        });
      }

      await Product.create({
        name: row["Product Name"],
        price: Number(row.Price),
        moq: Number(row.MOQ || 1),
        category: category._id,
        subCategory: subCategory?._id || null,
        thumbnail: row.Thumbnail, // REQUIRED (schema safe)
        images: parseArray(row.Images),
        video360: row.Video360 || "",
        services: parseArray(row.Services),
        features: parseArray(row.Features),
        availability: row.Availability || "In Stock",
        shortDescription: row["Short Description"] || "",
        description: row.Description || "",
      });

      success.push(rowNo);
    } catch (err) {
      errors.push(`Row ${rowNo}: ${err.message}`);
    }
  }

  return NextResponse.json({
    success: true,
    created: success.length,
    failed: errors,
    total: rows.length,
  });
}

function parseArray(val) {
  if (!val) return [];
  return String(val)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
