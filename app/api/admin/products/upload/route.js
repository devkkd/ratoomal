import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

export async function POST(request) {
  console.log("📥 Bulk upload API called");
  
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Database connected");

    // Get the uploaded file
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      console.log("❌ No file provided");
      return NextResponse.json(
        { 
          success: false, 
          message: "Please upload an Excel file" 
        },
        { status: 400 }
      );
    }

    console.log(`📄 Processing file: ${file.name} (${file.size} bytes)`);

    // Read Excel file
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`📊 Found ${rows.length} rows in Excel file`);

    const results = {
      success: [],
      errors: [],
      total: rows.length
    };

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // Excel rows start from 2 (header is row 1)

      try {
        console.log(`🔍 Processing row ${rowNumber}: ${row["Product Name*"] || row["Product Name"] || "Unnamed"}`);

        // Check required fields - handle both with and without asterisk
        const productName = row["Product Name*"] || row["Product Name"];
        const productCode = row["Product Code*"] || row["Product Code"];
        const price = row["Price*"] || row["Price"];
        const category = row["Category*"] || row["Category"];
        const thumbnail = row["Thumbnail URL*"] || row["Thumbnail URL"];

        if (!productName || !productCode || !price || !category || !thumbnail) {
          throw new Error("Missing required fields: Product Name, Product Code, Price, Category, or Thumbnail URL");
        }

        // Find category
        const categoryName = category.toString().trim();
        const categoryDoc = await Category.findOne({
          name: new RegExp(`^${categoryName}$`, "i"),
        });

        if (!categoryDoc) {
          throw new Error(`Category "${categoryName}" not found. Please create it first.`);
        }

        // Find sub-category if provided
        let subCategoryDoc = null;
        const subCategoryName = row["Sub Category"] || row["SubCategory"];
        if (subCategoryName) {
          const subCatName = subCategoryName.toString().trim();
          subCategoryDoc = await SubCategory.findOne({
            name: new RegExp(`^${subCatName}$`, "i"),
            category: categoryDoc._id,
          });
        }

        // Parse arrays (comma separated)
        const parseArray = (value) => {
          if (!value) return [];
          return value
            .toString()
            .split(",")
            .map(item => item.trim())
            .filter(item => item.length > 0);
        };

        // Create product object
        const productData = {
          name: productName.toString(),
          code: productCode.toString().toUpperCase(),
          price: parseFloat(price),
          moq: parseInt(row["MOQ"] || 1),
          category: categoryDoc._id,
          subCategory: subCategoryDoc?._id || null,
          thumbnail: thumbnail.toString(),
          images: parseArray(row["Image URLs (comma separated)"] || row["Image URLs"]),
          video360: row["Video URL"]?.toString() || "",
          services: parseArray(row["Services (comma separated)"] || row["Services"]),
          features: parseArray(row["Features (comma separated)"] || row["Features"]),
          availability: row["Availability"]?.toString() || "In Stock",
          description: row["Description"]?.toString() || "",
          shortDescription: row["Short Description"]?.toString() || "",
          godName: row["God Name"]?.toString() || "",
          color: row["Color"]?.toString() || "",
          suitableFor: row["Suitable For"]?.toString() || "",
          usage: row["Usage"]?.toString() || "",
          posture: row["Posture"]?.toString() || "",
          baseShape: row["Base Shape"]?.toString() || "",
          finish: row["Finish"]?.toString() || "",
          appearance: row["Appearance"]?.toString() || "",
          careInstruction: row["Care Instruction"]?.toString() || "",
          assemblyRequired: row["Assembly Required"]?.toString() || "",
          productType: row["Product Type"]?.toString() || ""
        };

        // Save to database
        const product = await Product.create(productData);
        results.success.push({
          row: rowNumber,
          productId: product._id,
          name: product.name
        });

        console.log(`✅ Row ${rowNumber}: Product "${product.name}" created successfully`);

      } catch (error) {
        const errorMessage = `Row ${rowNumber}: ${error.message}`;
        results.errors.push(errorMessage);
        console.error(`❌ ${errorMessage}`);
      }
    }

    // Return results
    const response = {
      success: true,
      created: results.success.length,
      failed: results.errors, // Frontend expects this to be the array of errors
      total: results.total,
      message: `Processed ${results.total} rows. ${results.success.length} created, ${results.errors.length} failed.`
    };

    console.log("📊 Bulk upload completed:", response);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error("💥 Bulk upload error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to process bulk upload",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Optional: GET method for testing
export async function GET() {
  return NextResponse.json({
    message: "Bulk Product Upload API",
    instructions: "POST an Excel file with product data",
    status: "active"
  });
}