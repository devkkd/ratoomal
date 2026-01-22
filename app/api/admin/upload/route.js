import cloudinary from "@/lib/cloudinary";
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

    // Determine resource type
    const resourceType = file.type.startsWith("video") ? "video" : "image";

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: folder,
          resource_type: resourceType
        },
        (err, res) => (err ? reject(err) : resolve(res))
      ).end(buffer);
    });

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
