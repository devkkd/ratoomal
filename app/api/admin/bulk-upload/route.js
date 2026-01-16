import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import cloudinary from "@/lib/cloudinary";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request) {
  console.log("📥 Bulk upload API called");
  
  let tempFilePath = '';
  
  try {
    await connectDB();

    // Get form data from request
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temp directory
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Save file temporarily
    tempFilePath = path.join(tempDir, `upload_${Date.now()}_${file.name}`);
    await writeFile(tempFilePath, buffer);
    
    console.log(`File saved to: ${tempFilePath}`);

    // Read Excel file directly from buffer
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Read ${rows.length} rows from Excel`);

    if (!rows.length) {
      await unlink(tempFilePath);
      return NextResponse.json(
        { success: false, message: "Excel file is empty" },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;

      try {
        console.log(`Processing row ${rowNumber}`);
        
        // Get values with multiple column name support
        const productName = row.name || row['Product Name'] || row['product_name'];
        const productPrice = row.price || row['Price'] || row['Price (₹)'];
        const productCategory = row.category || row['Category'] || row['category_name'];

        if (!productName || !productPrice || !productCategory) {
          errors.push(`Row ${rowNumber}: Missing required fields`);
          continue;
        }

        // Find category
        const category = await Category.findOne({ 
          $or: [
            { name: { $regex: new RegExp(`^${productCategory}$`, 'i') } },
            { slug: { $regex: new RegExp(`^${productCategory}$`, 'i') } }
          ]
        });
        
        if (!category) {
          errors.push(`Row ${rowNumber}: Category "${productCategory}" not found`);
          continue;
        }

        // Find subcategory if provided
        let subCategory = null;
        const subCategoryName = row.subCategory || row['Sub Category'] || row['subcategory'];
        if (subCategoryName) {
          subCategory = await SubCategory.findOne({
            $or: [
              { name: { $regex: new RegExp(`^${subCategoryName}$`, 'i') } },
              { slug: { $regex: new RegExp(`^${subCategoryName}$`, 'i') } }
            ],
            category: category._id
          });
        }

        // Process media files (simplified for now)
        let thumbnailUrl = '';
      const thumbnailPath = path.join(process.cwd(), "public/uploads/chairs", thumbnailInput);
thumbnailUrl = await uploadToCloudinaryFromBuffer(thumbnailPath, 'products/thumbnails');


        // Prepare product data
        const productData = {
          name: String(productName).trim(),
          price: parseFloat(productPrice) || 0,
          moq: parseInt(row.moq || row['MOQ'] || 1) || 1,
          category: category._id,
          subCategory: subCategory ? subCategory._id : null,
          thumbnail: thumbnailUrl,
          images: [],
          video360: '',
          services: parseArrayField(row.services || row['Services']),
          features: parseArrayField(row.features || row['Features']),
          godName: row.godName || row['God Name'] || '',
          color: row.color || row['Color'] || '',
          suitableFor: row.suitableFor || row['Suitable For'] || '',
          usage: row.usage || row['Usage'] || '',
          posture: row.posture || row['Posture'] || '',
          baseShape: row.baseShape || row['Base Shape'] || '',
          finish: row.finish || row['Finish'] || '',
          appearance: row.appearance || row['Appearance'] || '',
          careInstruction: row.careInstruction || row['Care Instructions'] || '',
          assemblyRequired: parseBoolean(row.assemblyRequired || row['Assembly Required']),
          availability: (row.availability || row['Availability']) && 
            ["In Stock", "Out of Stock"].includes(String(row.availability || row['Availability'])) 
              ? String(row.availability || row['Availability']) 
              : "In Stock",
          productType: row.productType || row['Product Type'] || '',
          shortDescription: row.shortDescription || row['Short Description'] || '',
          longDescription: row.longDescription || row['Long Description'] || '',
          description: row.description || row['Full Description'] || row['Description'] || '',
        };

        // Save to database
        const product = await Product.create(productData);
        results.push({
          productId: product._id,
          name: product.name,
          row: rowNumber
        });

        console.log(`✅ Created product: ${product.name}`);

      } catch (rowError) {
        console.error(`Error in row ${rowNumber}:`, rowError);
        errors.push(`Row ${rowNumber}: ${rowError.message || 'Unknown error'}`);
      }
    }

    // Clean up temp file
    if (tempFilePath && existsSync(tempFilePath)) {
      await unlink(tempFilePath);
      console.log("Temp file cleaned up");
    }

    const response = {
      success: true,
      message: `Processed ${rows.length} rows. Success: ${results.length}, Failed: ${errors.length}`,
      created: results,
      errors: errors.length > 0 ? errors.slice(0, 20) : undefined,
      summary: {
        total: rows.length,
        successful: results.length,
        failed: errors.length
      }
    };

    console.log("✅ Upload completed");
    return NextResponse.json(response);

  } catch (error) {
    console.error("❌ Bulk upload error:", error);
    
    // Clean up temp file on error
    if (tempFilePath && existsSync(tempFilePath)) {
      try {
        await unlink(tempFilePath);
      } catch (cleanupError) {
        console.error("Error cleaning up temp file:", cleanupError);
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Internal server error",
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

async function uploadToCloudinaryFromBuffer(filePath, folder) {
  if (!filePath) return "";

  // If it's already a URL
  if (filePath.startsWith("http")) return filePath;

  // Read file buffer
  let buffer;
  try {
    buffer = fs.readFileSync(filePath);
  } catch (err) {
    console.error("File read error:", filePath, err);
    return "";
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(buffer);
    });

    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", filePath, err);
    return "";
  }
}

// Helper function to parse array fields
function parseArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  
  try {
    return String(value)
      .split(',')
      .map(item => item.trim())
      .filter(item => item);
  } catch {
    return [];
  }
}

// Helper function to parse boolean
function parseBoolean(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  
  const lower = String(value).toLowerCase().trim();
  return ['true', 'yes', '1', 'y'].includes(lower);
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Bulk upload API is running",
    endpoint: "/api/products/bulk-upload",
    methods: ["POST"],
    description: "Upload Excel file with product data"
  });
}