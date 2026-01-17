import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

// This handles POST requests for bulk upload
export async function POST(req) {
  try {
    console.log('📥 Starting bulk upload...');
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    console.log('📄 Processing Excel file:', file.name, file.size);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log('📊 Found', rows.length, 'rows to process');

    const success = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNo = i + 2;

      try {
        console.log(`Processing row ${rowNo}:`, row["Product Name"] || 'Unnamed');
        
        // Required fields validation
        if (!row["Product Name"] || !row["Price"] || !row["Category"] || !row["Thumbnail URL"]) {
          throw new Error("Missing required fields (Name, Price, Category, Thumbnail)");
        }

        // Find category
        const category = await Category.findOne({
          name: new RegExp(`^${row.Category}$`, "i"),
        });
        
        if (!category) {
          throw new Error(`Category "${row.Category}" not found`);
        }

        // Find sub-category if provided
        let subCategory = null;
        if (row["Sub Category"]) {
          subCategory = await SubCategory.findOne({
            name: new RegExp(`^${row["Sub Category"]}$`, "i"),
            category: category._id,
          });
        }

        // Parse comma-separated arrays
        const parseCommaSeparated = (value) => {
          if (!value || typeof value !== 'string') return [];
          return value
            .split(',')
            .map(v => v.trim())
            .filter(v => v !== '');
        };

        // Create product data
        const productData = {
          name: row["Product Name"],
          price: parseFloat(row.Price),
          moq: parseInt(row.MOQ || 1),
          category: category._id,
          subCategory: subCategory?._id || null,
          thumbnail: row["Thumbnail URL"],
          images: parseCommaSeparated(row["Image URLs"]),
          video360: row["Video URL"] || "",
          services: parseCommaSeparated(row["Services"]),
          features: parseCommaSeparated(row["Features"]),
          availability: row["Availability"] || "In Stock",
          description: row["Description"] || "",
          shortDescription: row["Short Description"] || "",
          godName: row["God Name"] || "",
          color: row["Color"] || "",
          suitableFor: row["Suitable For"] || "",
          usage: row["Usage"] || "",
          posture: row["Posture"] || "",
          baseShape: row["Base Shape"] || "",
          finish: row["Finish"] || "",
          appearance: row["Appearance"] || "",
          careInstruction: row["Care Instruction"] || "",
          assemblyRequired: row["Assembly Required"] || "",
          productType: row["Product Type"] || ""
        };

        // Check if product already exists
        const existingProduct = await Product.findOne({
          name: productData.name,
          category: productData.category
        });

        if (existingProduct) {
          // Update existing product
          await Product.findByIdAndUpdate(existingProduct._id, productData);
          console.log(`✅ Updated existing product: ${productData.name}`);
        } else {
          // Create new product
          await Product.create(productData);
          console.log(`✅ Created new product: ${productData.name}`);
        }
        
        success.push(rowNo);

      } catch (err) {
        const errorMsg = `Row ${rowNo}: ${err.message}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    const result = {
      success: true,
      created: success.length,
      failed: errors,
      total: rows.length,
      message: `Processed ${rows.length} rows. ${success.length} successful, ${errors.length} failed.`
    };

    console.log('📊 Bulk upload result:', result);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error("💥 Bulk upload error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to process bulk upload" 
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to provide template or info
export async function GET() {
  return NextResponse.json({
    message: "Use POST method to upload Excel file",
    required_columns: [
      "Product Name*",
      "Price*", 
      "MOQ",
      "Category*",
      "Sub Category",
      "Thumbnail URL*",
      "Image URLs (comma separated)",
      "Video URL",
      "Services (comma separated)",
      "Features (comma separated)",
      "Availability",
      "Description",
      "Short Description",
      "God Name",
      "Color",
      "Suitable For",
      "Usage",
      "Posture",
      "Base Shape",
      "Finish",
      "Appearance",
      "Care Instruction",
      "Assembly Required",
      "Product Type"
    ],
    note: "* indicates required field"
  });
}