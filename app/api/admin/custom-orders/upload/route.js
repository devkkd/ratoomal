import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/cloudflare-r2";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files"); // Changed to getAll for multiple files

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      
      const result = await uploadToR2(buffer, fileName, file.type, "custom-orders");
      return result.secure_url;
    });

    const urls = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      urls
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}