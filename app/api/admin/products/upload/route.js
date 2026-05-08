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
        const productCode = (row["Product Code*"] || row["Product Code"] || "").toString().trim();
        // Product Name is optional — falls back to Product Code if blank
        const productName = (row["Product Name*"] || row["Product Name"] || productCode).toString().trim();
        // Price is optional — defaults to 0
        const price = row["Price*"] || row["Price"] || 0;
        const category = row["Category*"] || row["Category"];
        const thumbnail = row["Thumbnail URL*"] || row["Thumbnail URL"];

        // Only Product Code and Category are truly required
        const missingFields = [];
        if (!productCode) missingFields.push("Product Code");
        if (!category) missingFields.push("Category");
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
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

        // Parse arrays (comma separated) — handles inch marks and extra spaces
        const parseArray = (value) => {
          if (!value) return [];
          const str = value.toString().trim();
          // If the whole value looks like a single string with commas, split it
          return str
            .split(",")
            .map(item => item.trim())
            .filter(item => item.length > 0);
        };

        // Parse sizes specifically — handles missing commas like `4" 5"` → `4"`, `5"`
        const parseSizes = (value) => {
          if (!value) return [];
          let str = value.toString().trim();
          // Normalize fancy/curly quotes to straight double-quote
          str = str.replace(/[""]/g, '"');
          // Split by comma first
          const byComma = str.split(",").map(s => s.trim()).filter(Boolean);
          // For each chunk, if it contains multiple size tokens (e.g. `4" 5"`), split further
          const result = [];
          for (const chunk of byComma) {
            // Match patterns like: 2", 2.5", 3", 4 inch, 10 inch etc.
            const tokens = chunk.match(/\d+(?:\.\d+)?(?:"|''|inch| inch)?/gi);
            if (tokens && tokens.length > 1) {
              // Multiple sizes crammed together — split them
              tokens.forEach(t => result.push(t.trim()));
            } else {
              result.push(chunk);
            }
          }
          return result.filter(Boolean);
        };

        // Create product object
        const productData = {
          name: productName.toString(),
          code: productCode.toString().toUpperCase(),
          price: price ? parseFloat(price) : 0,
          moq: parseInt(row["MOQ"] || 1),
          category: categoryDoc._id,
          subCategory: subCategoryDoc?._id || null,
          thumbnail: (thumbnail && !thumbnail.includes("your-cloud")) ? thumbnail.toString() : "",
          images: parseArray(row["Image URLs (comma separated)"] || row["Image URLs"]).filter(url => !url.includes("your-cloud")),
          video360: row["Video URL"]?.toString() || "",
          services: parseArray(row["Services (comma separated)"] || row["Services"]),
          features: parseArray(row["Features (comma separated)"] || row["Features"]),
          sizes: parseSizes(row["Sizes (comma separated)"] || row["Sizes"]),
          material: row["Material"]?.toString() || "Plastic",
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

        console.log(`🔍 Row ${rowNumber} Sizes:`, {
          rawSizes: row["Sizes (comma separated)"] || row["Sizes"],
          parsedSizes: productData.sizes
        });

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