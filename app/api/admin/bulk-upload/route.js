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

    // Read Excel file with better parsing options
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { 
      type: "buffer",
      cellText: false,
      cellDates: true,
      raw: false
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert sheet to JSON with header row
    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1, // Get raw array first
      defval: "", // Default value for empty cells
      raw: false // Don't use raw values
    });

    console.log('📊 [BULK UPLOAD] Found', rows.length, 'rows in sheet:', sheetName);
    
    // Get headers from first row and convert to objects
    if (rows.length < 2) {
      throw new Error('Excel file must have at least a header row and one data row');
    }
    
    const headers = rows[0];
    const dataRows = rows.slice(1).map((row, index) => {
      const obj = {};
      headers.forEach((header, colIndex) => {
        obj[header] = row[colIndex] || "";
      });
      return obj;
    });

    console.log('📊 [BULK UPLOAD] Headers found:', headers);
    console.log('📊 [BULK UPLOAD] Processing', dataRows.length, 'data rows');
    
    // Debug: Log the first row to see column names
    if (dataRows.length > 0) {
      console.log('🔍 [BULK UPLOAD] First row columns:', Object.keys(dataRows[0]));
      console.log('🔍 [BULK UPLOAD] First row data sample:', {
        "Product Name": dataRows[0]["Product Name"],
        "Product Code": dataRows[0]["Product Code"], 
        "Price": dataRows[0]["Price"],
        "Category": dataRows[0]["Category"],
        "Thumbnail URL": dataRows[0]["Thumbnail URL"]
      });
    }

    const success = [];
    const errors = [];

    // Process each row
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNo = i + 2; // Excel rows start at 2 (1 is header)

      try {
        // Skip empty rows or rows that don't have meaningful product data
        const hasProductName = row["Product Name"] && row["Product Name"].toString().trim() !== '';
        const hasProductCode = row["Product Code"] && row["Product Code"].toString().trim() !== '';
        const hasPrice = row["Price"] !== undefined && row["Price"] !== null && row["Price"] !== '';
        const hasCategory = row["Category"] && row["Category"].toString().trim() !== '';
        const hasThumbnail = row["Thumbnail URL"] && row["Thumbnail URL"].toString().trim() !== '';
        
        // Skip if this row doesn't have any meaningful product data
        if (!hasProductName && !hasProductCode && !hasPrice && !hasCategory && !hasThumbnail) {
          console.log(`⏭️ [BULK UPLOAD] Skipping empty row ${rowNo}`);
          continue;
        }

        // Log current row
        console.log(`🔍 [BULK UPLOAD] Processing row ${rowNo}:`, row["Product Name"] || 'Unnamed product');
        console.log(`🔍 [BULK UPLOAD] Row ${rowNo} data:`, {
          "Product Name": row["Product Name"],
          "Product Code": row["Product Code"],
          "Price": row["Price"], 
          "Category": row["Category"],
          "Thumbnail URL": row["Thumbnail URL"]
        });

        // Validate required fields with detailed checking
        const requiredFields = [
          { name: "Product Name", value: row["Product Name"] },
          { name: "Product Code", value: row["Product Code"] },
          { name: "Price", value: row["Price"] },
          { name: "Category", value: row["Category"] },
          { name: "Thumbnail URL", value: row["Thumbnail URL"] }
        ];
        
        const missingFields = [];
        
        requiredFields.forEach(field => {
          // For price, allow 0 as valid value, just check if it exists and is a number
          if (field.name === "Price") {
            if (field.value === undefined || field.value === null || field.value === '' || isNaN(field.value)) {
              missingFields.push(field.name);
            }
          } else {
            // For other fields, check if empty or null
            if (!field.value || field.value.toString().trim() === '') {
              missingFields.push(field.name);
            }
          }
        });
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
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
          name: row["Product Name"].toString().trim(),
          code: row["Product Code"].toString().trim(), // Required field, must not be empty
          price: parseFloat(row["Price"]) || 0, // Allow 0 as valid price
          moq: parseInt(row["MOQ"]) || 1, // Use correct field name 'moq'
          category: category._id,
          subCategory: subCategory?._id || null,
          thumbnail: row["Thumbnail URL"].toString().trim(),
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
          material: row["Material"]?.toString() || "Plastic",
          size: row["Size"]?.toString() || "6 inch",
          appearance: row["Appearance"]?.toString() || "",
          careInstruction: row["Care Instruction"]?.toString() || "",
          assemblyRequired: row["Assembly Required"]?.toString() || "",
          productType: row["Product Type"]?.toString() || ""
        };

        // Check if product code already exists (since it must be unique)
        const existingCodeProduct = await Product.findOne({ code: productData.code });
        
        // Check if product already exists (by code or name+category)
        const existingProduct = await Product.findOne({
          $or: [
            { _id: existingCodeProduct?._id }, // Same code
            { name: productData.name, category: productData.category } // Same name+category
          ]
        });

        if (existingProduct) {
          // Update existing product
          await Product.findByIdAndUpdate(existingProduct._id, productData, { new: true });
          console.log(`✅ [BULK UPLOAD] Updated existing product: "${productData.name}" (${productData.code})`);
        } else {
          // Create new product
          await Product.create(productData);
          console.log(`✅ [BULK UPLOAD] Created new product: "${productData.name}" (${productData.code})`);
        }
        
        success.push(rowNo);

      } catch (err) {
        const errorMsg = `Row ${rowNo}: ${err.message}`;
        console.error(`❌ [BULK UPLOAD] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    // Calculate processed rows (excluding skipped empty rows)
    const processedRows = success.length + errors.length;
    
    // Prepare response
    const result = {
      success: true,
      created: success.length,
      failed: errors,
      total: dataRows.length,
      processed: processedRows,
      skipped: dataRows.length - processedRows,
      message: `Found ${dataRows.length} rows. Processed ${processedRows} rows. ${success.length} successful, ${errors.length} failed.`
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
      "Product Code*",
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