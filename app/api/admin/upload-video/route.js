import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/cloudflare-r2";

// Allow up to 200MB and 5 minutes for video uploads
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { success: false, message: "Only video files are allowed (MP4, MOV, AVI, WEBM)" },
        { status: 400 }
      );
    }

    // 200MB limit for videos
    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "Video too large. Maximum size is 200MB." },
        { status: 400 }
      );
    }

    console.log(`📹 Uploading video: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${timestamp}-${safeName}`;

    const uploadResult = await uploadToR2(buffer, fileName, file.type, "products/videos");

    console.log(`✅ Video uploaded: ${uploadResult.secure_url}`);

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      message: "Video uploaded successfully",
    });

  } catch (error) {
    console.error("❌ VIDEO UPLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Video upload failed" },
      { status: 500 }
    );
  }
}
