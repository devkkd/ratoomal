import { uploadToR2 } from "@/lib/cloudflare-r2";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "products";

    if (!file) {
      return NextResponse.json({
        success: false,
        error: "No file provided"
      }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    // Determine resource type
    const resourceType = file.type.startsWith("video") ? "video" : "image";

    const upload = await uploadToR2(buffer, fileName, file.type, folder);

    return NextResponse.json({
      success: true,
      url: upload.secure_url,
      publicId: upload.public_id,
      type: resourceType,
      folder: folder
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Upload failed"
    }, { status: 500 });
  }
}
