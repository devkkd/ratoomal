import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

// Handle POST request for bulk upload
export async function POST(request) {
  try {
    console.log('📥 [BULK UPLOAD] Starting bulk upload process');
    
    // Connect to database
    await connectDB();
    console.log('✅ [BULK UPLOAD] Database connected');

    // Get the file from form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      console.log('❌ [BULK UPLOAD] No file provided');
      return NextResponse.json(
        { 
          success: false, 
          message: "No file provided" 
        },
        { status: 400 }
      );
    }

    console.log('📄 [BULK UPLOAD] Processing file:', file.name, 'Size:', file.size);

    // Read Excel file
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log('📊 [BULK UPLOAD] Found', rows.length, 'rows in sheet:', sheetName);

    const success = [];
    const errors = [];

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNo = i + 2; // Excel rows start at 2 (1 is header)

      try {
        // Log current row
        console.log(`🔍 [BULK UPLOAD] Processing row ${rowNo}:`, row["Product Name"] || 'Unnamed product');

        // Validate required fields
        if (!row["Product Name"] || !row["Price"] || !row["Category"] || !row["Thumbnail URL"]) {
          throw new Error("Missing required fields (Product Name, Price, Category, Thumbnail URL)");
        }

        // Find category
        const category = await Category.findOne({
          name: new RegExp(`^${row.Category}$`, "i"),
        });
        
        if (!category) {
          throw new Error(`Category "${row.Category}" not found in database`);
        }

        // Find sub-category if provided
        let subCategory = null;
        if (row["Sub Category"]) {
          subCategory = await SubCategory.findOne({
            name: new RegExp(`^${row["Sub Category"]}$`, "i"),
            category: category._id,
          });
        }

        // Helper function to parse comma-separated strings
        const parseCommaSeparated = (value) => {
          if (!value || typeof value !== 'string') return [];
          return value
            .split(',')
            .map(v => v.trim())
            .filter(v => v !== '' && v !== 'null' && v !== 'undefined');
        };

        // Prepare product data
        const productData = {
          name: row["Product Name"].toString(),
          price: parseFloat(row.Price),
          moq: parseInt(row.MOQ || 1),
          category: category._id,
          subCategory: subCategory?._id || null,
          thumbnail: row["Thumbnail URL"].toString(),
          images: parseCommaSeparated(row["Image URLs"]),
          video360: row["Video URL"]?.toString() || "",
          services: parseCommaSeparated(row["Services"]),
          features: parseCommaSeparated(row["Features"]),
          availability: row["Availability"] || "In Stock",
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

        // Check if product already exists
        const existingProduct = await Product.findOne({
          name: productData.name,
          category: productData.category
        });

        if (existingProduct) {
          // Update existing product
          await Product.findByIdAndUpdate(existingProduct._id, productData, { new: true });
          console.log(`✅ [BULK UPLOAD] Updated existing product: "${productData.name}"`);
        } else {
          // Create new product
          await Product.create(productData);
          console.log(`✅ [BULK UPLOAD] Created new product: "${productData.name}"`);
        }
        
        success.push(rowNo);

      } catch (err) {
        const errorMsg = `Row ${rowNo}: ${err.message}`;
        console.error(`❌ [BULK UPLOAD] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    // Prepare response
    const result = {
      success: true,
      created: success.length,
      failed: errors,
      total: rows.length,
      message: `Processed ${rows.length} rows. ${success.length} successful, ${errors.length} failed.`
    };

    console.log('📊 [BULK UPLOAD] Final result:', result);
    
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error("💥 [BULK UPLOAD] Critical error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to process bulk upload",
        error: error.toString()
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

// Handle GET request (for testing/info)
export async function GET() {
  console.log('📥 [BULK UPLOAD] GET request received');
  
  return NextResponse.json({
    message: "Bulk Product Upload API",
    instructions: "POST an Excel file with product data",
    required_fields: [
      "Product Name*",
      "Price*",
      "Category*",
      "Thumbnail URL*"
    ],
    optional_fields: [
      "Sub Category",
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
    note: "* indicates required field",
    status: "active",
    timestamp: new Date().toISOString()
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}